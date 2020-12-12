import { LOGIN_SCHEMA, REFRESH_TOKEN_SCHEMA } from './../config/users-schema';
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
            responseBody = await this.authController.login(request.body);
        } else {
          responseBody = new HTTPErrorResponse(getListOfErrors(validateScehma));
        }

        response.status(200);
        response.json(responseBody);
      }
    );


    this.router.post(
      '/refresh-token',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        const validateScehma = Joi.validate(request.body, REFRESH_TOKEN_SCHEMA);

        if (!validateScehma.error) {
            responseBody = await this.authController.refreshToken(request.body.token);
        } else {
          responseBody = new HTTPErrorResponse(getListOfErrors(validateScehma));
        }

        response.status(200);
        response.json(responseBody);
      }
    );
    this.router.get(
      '/get-user-by-token',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
        const token = request.header('authorization');

        responseBody = await this.authController.getUserByToken(String(token));

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
          const token = request.header('authorization');
          if(!token){

            responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]); 

          }else{

            responseBody = await this.authController.logout( token );

          }

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
      '/generate-reset-password',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        if (request.body.username) {
            responseBody = await this.authController.generateResetPasswordToken(
              request.body.username
            );
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
      '/change-password-by-token/:token',
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
            responseBody = await this.authController.changePasswordByToken(
              request.params.token,
              request.body.newPassword
            );
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
      '/login-as/:_id',
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
              responseBody = await this.authController.loginAs(
                request.params._id
              );
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
