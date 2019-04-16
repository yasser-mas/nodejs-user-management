import { UserController } from './../controllers/users-controller';
import express from 'express';
import { verify } from 'jsonwebtoken';
import HTTPAuthErrorResponse from '../lib/http/http-error-auth';
import { AuthController } from '../controllers/auth-controller';

const authController = new AuthController();
const userController = new UserController();

export async function httpInterceptor(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.header('token');

  /*
   * Validate if request require token and permission or not
   */

  const checkPermissions = authController.checkPermissions(req);
  let parsedToken;

  // if token required ? => Validate Token
  if (checkPermissions.tokenRequired) {
    if (!token) {
      res.json(new HTTPAuthErrorResponse());
      return;
    } else {
      try {
        // Parse Token
        parsedToken = await verify(token, String(process.env.JWT_SECRET_KEY));

        // If Invalid Token Return Unauth error message
        if (!((<any> parsedToken)._id && (<any>parsedToken).username)) {
          return res.json(new HTTPAuthErrorResponse());
        }

        // If valid ? get user by token
        const user = await userController.getUserByToken(token);

        // If can't find active session for this token ? return unauth error
        if (!user) {
          return res.json(new HTTPAuthErrorResponse());
        }

        // Store parsed token and user data to be used in route controller
        res.locals.tokenData = parsedToken;
        res.locals.userData = user;
      } catch (e) {
        console.log(e);
        res.json(new HTTPAuthErrorResponse());
        return;
      }
    }
  }

  // If Permission required and user is not a SUPER USER o.O
  if (checkPermissions.permissionRequired && !res.locals.userData.isSuperUser) {
    try {
      /*
       * If permission required so token is required
       * so if it pass token verification it must have user data
       */
      if (res.locals.userData) {
        // Check if user permissions includes request url and method
        const isAuthorized = await authController.isAuthorized(
          res.locals.userData,
          req
        );

        if (!isAuthorized) {
          res.json(new HTTPAuthErrorResponse());
          return;
        }
      } else {
        res.json(new HTTPAuthErrorResponse());
        return;
      }
    } catch (error) {
      res.json(new HTTPAuthErrorResponse());
      return;
    }
  }

  // Congrats :D
  next();
}
