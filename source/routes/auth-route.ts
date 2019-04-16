import { LOGIN_SCHEMA, LOGOUT_SCHEMA } from './../config/users-schema';
import Joi from 'joi';
import express from 'express';
import HTTPErrorResponse from '../lib/http/http-error-response';
import HTTPSuccessResponse from '../lib/http/http-success-response';
import { getListOfErrors } from '../lib/schema-helper';
import { AuthController } from '../controllers/auth-controller';
import HTTPAuthErrorResponse from '../lib/http/http-error-auth';
import { Types } from 'mongoose';
import { ERROR_CODES } from '../lib/error-codes';

export class AuthRoutes {
  router: express.Router = express.Router();
  authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.constructRoutes();
  }

  constructRoutes() {
    this.router.post(
      '/login',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        const validateScehma = Joi.validate(request.body, LOGIN_SCHEMA);

        if (!validateScehma.error) {
          try {
            responseBody = await this.authController.login(request.body);
          } catch (error) {
            responseBody = new HTTPErrorResponse([
              { code: error.code || 500, message: error.message }
            ]);
          }
        } else {
          responseBody = new HTTPErrorResponse(getListOfErrors(validateScehma));
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.get(
      '/getUserByToken',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        try {
          let user = response.locals.userData;
          if (user) {
            responseBody = new HTTPSuccessResponse(response.locals.userData);
          } else {
            responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]);
          }
        } catch (error) {
          responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]);
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.post(
      '/logout',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        try {
          responseBody = await this.authController.logout(
            request.header('token') || ''
          );
        } catch (error) {
          responseBody = new HTTPErrorResponse([
            { code: error.code || 500, message: error.message }
          ]);
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.post(
      '/GenerateResetPassword',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        if (request.body.username) {
          try {
            responseBody = await this.authController.generateResetPasswordToken(
              request.body.username
            );
          } catch (error) {
            responseBody = new HTTPErrorResponse([
              { code: error.code || 500, message: error.message }
            ]);
          }
        } else {
          responseBody = new HTTPErrorResponse([
            ERROR_CODES.USER_NAME_REQUIRED
          ]);
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.post(
      '/changePasswordByToken/:token',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        if (
          request.body.newPassword &&
          Types.ObjectId.isValid(request.params.token)
        ) {
          try {
            responseBody = await this.authController.changePasswordByToken(
              request.params.token,
              request.body.newPassword
            );
          } catch (error) {
            responseBody = new HTTPErrorResponse([
              { code: error.code || 500, message: error.message }
            ]);
          }
        } else {
          responseBody = new HTTPErrorResponse([
            ERROR_CODES.INVALID_TOKEN_OR_PASS
          ]);
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.post(
      '/loginAs/:_id',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        if (!response.locals.userData.isSuperUser) {
          responseBody = new HTTPAuthErrorResponse();
        } else {
          if (request.params._id) {
            try {
              responseBody = await this.authController.loginAs(
                request.params._id
              );
            } catch (error) {
              responseBody = new HTTPErrorResponse([
                { code: error.code || 500, message: error.message }
              ]);
            }
          } else {
            responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]);
          }
        }

        response.status(200);
        response.json(responseBody);
      }
    );
  }
}
