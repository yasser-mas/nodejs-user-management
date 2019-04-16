import Joi from 'joi';
import express from 'express';
import HTTPErrorResponse from '../lib/http/http-error-response';
import HTTPSuccessResponse from '../lib/http/http-success-response';
import { getListOfErrors } from '../lib/schema-helper';
import { Types } from 'mongoose';
import { GroupController } from '../controllers/groups.controller';
import {
  GET_ALL_GROUPS,
  ADD_GROUP_SCHEMA,
  EDIT_GROUP_SCHEMA
} from '../config/groups-schema';
import { ERROR_CODES } from '../lib/error-codes';

export class GroupsRoutes {
  router: express.Router = express.Router();
  groupController: GroupController;

  constructor() {
    this.groupController = new GroupController();
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

        const validateScehma = Joi.validate(request.query, GET_ALL_GROUPS);

        if (!validateScehma.error) {
          try {
            responseBody = await this.groupController.getAllGroups(
              request.query
            );
          } catch (error) {
            responseBody = new HTTPErrorResponse([
              { code: 500, message: error.message }
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

        if (Types.ObjectId.isValid(request.params._id)) {
          try {
            responseBody = await this.groupController.getGroupById(
              request.params
            );
          } catch (error) {
            responseBody = new HTTPErrorResponse([
              { code: 500, message: error.message }
            ]);
          }
        } else {
          responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_GROUP_ID]);
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
            responseBody = await this.groupController.deleteGroupById(
              request.params
            );
          } catch (error) {
            responseBody = new HTTPErrorResponse([
              { code: 500, message: error.message }
            ]);
          }
        } else {
          responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_GROUP_ID]);
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

        const validateScehma = Joi.validate(request.body, ADD_GROUP_SCHEMA);

        if (!validateScehma.error) {
          try {
            responseBody = await this.groupController.addGroup(request.body);
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

        const validateScehma = Joi.validate(request.body, EDIT_GROUP_SCHEMA);

        if (!validateScehma.error) {
          try {
            responseBody = await this.groupController.editGroup(request.body);
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
