import {
  GET_USER_BY_ID,
  NEW_USER_SCHEMA,
  EDIT_USER_SCHEMA,
  GET_ALL_USERS,
  CHANGE_PASSWORD_SCHEMA,
  CHANGE_OWN_INFO_SCHEMA
} from './../config/users-schema';
import Joi from 'joi';
import express from 'express';
import HTTPErrorResponse from '../lib/http/http-error-response';
import HTTPSuccessResponse from '../lib/http/http-success-response';
import { UserController } from '../controllers/users-controller';
import { getListOfErrors } from '../lib/schema-helper';
import { Types } from 'mongoose';
import HTTPAuthErrorResponse from '../lib/http/http-error-auth';
import { ERROR_CODES } from '../lib/error-codes';

export class UserRoutes {
  router: express.Router = express.Router();
  userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.constructRoutes();
  }

  constructRoutes() {
    this.router.get(
      '/',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        const validateScehma = Joi.validate(request.query, GET_ALL_USERS);

        if (!validateScehma.error) {
          try {
            responseBody = await this.userController.getAllUsers(request.query);
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
      '/:_id',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        // const validateScehma = Joi.validate(request.params , GET_USER_BY_ID);

        if (Types.ObjectId.isValid(request.params._id)) {
          try {
            responseBody = await this.userController.getUserById(
              request.params
            );
          } catch (error) {
            responseBody = new HTTPErrorResponse([
              { code: 500, message: error.message }
            ]);
          }
        } else {
          responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]);
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.delete(
      '/:_id',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        if (Types.ObjectId.isValid(request.params._id)) {
          try {
            responseBody = await this.userController.deleteUserById(
              request.params
            );
          } catch (error) {
            responseBody = new HTTPErrorResponse([
              { code: 500, message: error.message }
            ]);
          }
        } else {
          responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]);
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.post(
      '/',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        const validateScehma = Joi.validate(request.body, NEW_USER_SCHEMA);

        if (!validateScehma.error) {
          try {
            responseBody = await this.userController.addUser(request.body);
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

    this.router.put(
      '/',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        const validateScehma = Joi.validate(request.body, EDIT_USER_SCHEMA);

        if (!validateScehma.error) {
          try {
            responseBody = await this.userController.editUser(request.body);
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

    this.router.put(
      '/changeOwnInfo',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        if (response.locals.tokenData._id !== request.body._id) {
          response.status(200);
          response.json(new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]));
          return;
        }

        const validateScehma = Joi.validate(
          request.body,
          CHANGE_OWN_INFO_SCHEMA
        );

        if (!validateScehma.error) {
          try {
            responseBody = await this.userController.editUser(request.body);
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

    this.router.put(
      '/changeOwnPassword',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        // console.log(response.locals.tokenData);
        const requestBody = request.body;
        const tokenData = response.locals.tokenData;

        if (tokenData._id !== requestBody._id) {
          response.status(200);
          response.json(new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]));
          return;
        }

        const validateScehma = Joi.validate(
          request.body,
          CHANGE_PASSWORD_SCHEMA
        );


        if (!validateScehma.error) {
          try {
            responseBody = await this.userController.changePassword(
              requestBody
            );
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

    this.router.put(
      '/changeOtherPassword',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        const validateScehma = Joi.validate(request.body, EDIT_USER_SCHEMA);

        if (!validateScehma.error) {
          try {
            responseBody = await this.userController.editUser(request.body);
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
  }
}
