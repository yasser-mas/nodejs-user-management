import { UserModel, IUserDocument } from './../models/users-model';
import HTTPErrorResponse from './../lib/http/http-error-response';
import HTTPSuccessResponse from '../lib/http/http-success-response';
import { sign, verify } from 'jsonwebtoken';
import HTTPAuthErrorResponse from '../lib/http/http-error-auth';
import { Request } from 'express';
import { hash, compare } from 'bcrypt';
import { PermissionsList } from '../lib/cached-permissions';
import { ERROR_CODES } from '../lib/error-codes';
export class AuthController {
  constructor() {}

  async login(body: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {
    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    try {
      const user = await UserModel.getUserByUsername(body.username);

      // If User Exists and hashed password match given password
      if (user && (await compare(body.password, <string>user.password))) {
        // Token Obj
        const tokenObj = {
          _id: user._id,
          username: user.username
        };

        // Generate token
        const token = sign(tokenObj, String(process.env.JWT_SECRET_KEY));

        // Add session to user
        const updatedUser = await UserModel.addSession(user, token);

        if (updatedUser) {
          responseBody = new HTTPSuccessResponse({
            user: updatedUser,
            tokenObj:
              updatedUser.activeSessions[updatedUser.activeSessions.length - 1]
          });
        } else {
          responseBody = new HTTPErrorResponse([ERROR_CODES.GENERATE_TOKEN]);
        }

        // Remove All Expired Sessions Async
        this.removeOldSessions(user);
      } else {
        responseBody = new HTTPErrorResponse([
          ERROR_CODES.WRONG_USERNAME_OR_PASS
        ]);
      }
    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([
        ERROR_CODES.WRONG_USERNAME_OR_PASS
      ]);
    }

    return responseBody;
  }

  // Login As For Super user only who can login as any user
  async loginAs(_id: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {
    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    try {
      // Get User who want to login as him
      const user = await UserModel.getUserById(_id);

      if (user) {
        const tokenObj = {
          _id: user._id,
          username: user.username
        };

        const token = sign(tokenObj, String(process.env.JWT_SECRET_KEY));

        const updatedUser = await UserModel.addSession(user, token);

        if (updatedUser) {
          responseBody = new HTTPSuccessResponse({
            user: updatedUser,
            tokenObj:
              updatedUser.activeSessions[updatedUser.activeSessions.length - 1]
          });
        } else {
          responseBody = new HTTPErrorResponse([ERROR_CODES.GENERATE_TOKEN]);
        }

        this.removeOldSessions(user);
      } else {
        responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]);
      }
    } catch (error) {
      responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]);
    }

    return responseBody;
  }

  async logout(
    token: string
  ): Promise<HTTPErrorResponse | HTTPSuccessResponse> {
    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    const user = await UserModel.logout(token);

    responseBody = new HTTPSuccessResponse(user);

    return responseBody;
  }

  // Generate Reset passsword token
  async generateResetPasswordToken(
    username: string
  ): Promise<HTTPErrorResponse | HTTPSuccessResponse> {
    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    const user = await UserModel.generateResetPasswordToken(username);

    if (!user) {
      responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]);
    } else {
      responseBody = new HTTPSuccessResponse(user);

      // Send Mail Here ----------------------->
    }

    return responseBody;
  }

  // Reset password by generated token
  async changePasswordByToken(
    token: string,
    newPassword: string
  ): Promise<HTTPErrorResponse | HTTPSuccessResponse> {
    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    try {
      const hashedPassword = await hash(newPassword, 10);

      newPassword = hashedPassword;

      const user = await UserModel.changePasswordByToken(token, newPassword);

      if (!user) {
        responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]);
      } else {
        responseBody = new HTTPSuccessResponse(user);
      }
    } catch (error) {
      responseBody = new HTTPErrorResponse([ERROR_CODES.UNEXPECTED_ERROR]);
    }

    return responseBody;
  }

  // Check if user permissions contain request URL and Method
  async isAuthorized(user: IUserDocument, request: Request): Promise<boolean> {
    let isAuthorized = false;

    if (user && user._id) {
      /*
       * Foreach user permission split url
       * Split request path
       * If permission url contains ? that's mean this is path param
       *     => change request url path param to be ? to compare permission against the request url
       *     => /changeUserByID/1231231231  => /changeUserByID/?
       */
      user.getAllPermissions().forEach(permission => {
        let requestPath = request.path.split('/');

        permission.path.split('/').forEach((path, index, fullPath) => {
          if (path == '?' && requestPath[index]) {
            requestPath[index] = '?';
          }
        });

        if (
          permission.path.toLowerCase() ===
            requestPath.join('/').toLowerCase() &&
          permission.method.toLowerCase() === request.method.toLowerCase()
        ) {
          isAuthorized = true;
          return;
        }
      });
    }
    return isAuthorized;
  }

  /*
   *
   * If Request URL and Method not exists in permissions list so it's public WS
   * If It exists ?
   *   1st => if is default permission so no need to check if user has permission in user permissions list
   *   2nd => if not default so user should have the permission in user permissions list
   *   3rd => if permission required so token should be required to get user permissions by token
   *
   *
   */
  checkPermissions(
    request: Request
  ): { tokenRequired: boolean; permissionRequired: boolean } {
    let permissionRequired = false;
    let tokenRequired = false;

    PermissionsList.getPermissionsList().forEach(permission => {
      let requestPath = request.path.split('/');

      permission.path.split('/').forEach((path, index, fullPath) => {
        if (path == '?' && requestPath[index]) {
          requestPath[index] = '?';
        }
      });

      // If request url and method exists in permissions list
      if (
        permission.path.toLowerCase() === requestPath.join('/').toLowerCase() &&
        permission.method.toLowerCase() === request.method.toLowerCase()
      ) {
        permissionRequired = !permission.isDefault;
        tokenRequired = true;
        return;
      }
    });
    console.log({ permissionRequired, tokenRequired });
    return { permissionRequired, tokenRequired };
  }

  async getUserByToken(
    token: string
  ): Promise<HTTPErrorResponse | HTTPSuccessResponse> {
    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    try {
      const user = await UserModel.getUserByToken(token);

      if (user) {
        responseBody = new HTTPSuccessResponse(user);

        // Update session expiry and remove expired session Asyc
        UserModel.updateSessionExpiry(token);
        this.removeOldSessions(user);
      } else {
          responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]);
      }
    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]);
    }

    return responseBody;
  }

  removeOldSessions(user: IUserDocument) {
    UserModel.removeOldSessions(user);
  }
}
