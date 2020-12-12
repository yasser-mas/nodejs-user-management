import {
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
            responseBody = await this.userController.getAllUsers(request.query);
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
            responseBody = await this.userController.getUserById(
              request.params
            );
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
          responseBody = await this.userController.deleteUserById(
            request.params
          );
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
          responseBody = await this.userController.addUser(request.body);
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
          responseBody = await this.userController.editUser(request.body);
        } else {
          responseBody = new HTTPErrorResponse(getListOfErrors(validateScehma));
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.put(
      '/change-own-info',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
        const userData = response.locals.userData;

        if (userData._id !== request.body._id) {
          response.status(200);
          response.json(new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]));
          return;
        }

        const validateScehma = Joi.validate(
          request.body,
          CHANGE_OWN_INFO_SCHEMA
        );

        if (!validateScehma.error) {
            responseBody = await this.userController.editUser(request.body);
        } else {
          responseBody = new HTTPErrorResponse(getListOfErrors(validateScehma));
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.put(
      '/change-own-password',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        const requestBody = request.body;
        const userData = response.locals.userData;

        if (userData._id !== requestBody._id) {
          response.status(200);
          response.json(new HTTPErrorResponse([ERROR_CODES.INVALID_TOKEN]));
          return;
        }

        const validateScehma = Joi.validate(
          request.body,
          CHANGE_PASSWORD_SCHEMA
        );


        if (!validateScehma.error) {
          responseBody = await this.userController.changePassword(
            requestBody
          );
        } else {
          responseBody = new HTTPErrorResponse(getListOfErrors(validateScehma));
        }

        response.status(200);
        response.json(responseBody);
      }
    );

    this.router.put(
      '/change-other-password',
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

        const validateScehma = Joi.validate(request.body, EDIT_USER_SCHEMA);

        if (!validateScehma.error) {
          responseBody = await this.userController.editUser(request.body);
        } else {
          responseBody = new HTTPErrorResponse(getListOfErrors(validateScehma));
        }

        response.status(200);
        response.json(responseBody);
      }
    );
  }
}
