import HTTPErrorResponse from './../lib/http/http-error-response';
import HTTPSuccessResponse from '../lib/http/http-success-response';
import { GroupsModel, IGroupsModel } from '../models/groups-model';
import { ERROR_CODES } from '../lib/error-codes';

export class GroupController {


  constructor() {
  }


  async getAllGroups(body: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    try {
      const allGroups = GroupsModel.getAllGroups(body);
      const count = GroupsModel.countGroups(body);
      responseBody = new HTTPSuccessResponse({ list: await allGroups, count: await count });

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: error.code, message: error.message }]);

    }
    return responseBody;

  }


  async getGroupById(body: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {

      const group = await GroupsModel.getGroupById(body._id);

      responseBody = new HTTPSuccessResponse(group);

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: error.code, message: error.message }]);
    }
    return responseBody;

  }


  async deleteGroupById(body: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {
      const groupExists = await GroupsModel.getGroupById(body._id);
      if( !groupExists){
        return new HTTPErrorResponse([ERROR_CODES.INVALID_GROUP_ID]);
      }
      await GroupsModel.softDelete(body._id);
      responseBody = new HTTPSuccessResponse({});

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: error.code, message: error.message }]);
    }
    return responseBody;

  }


  async addGroup(group: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {
      const groupExists = await GroupsModel.getGroupByName(group.name);

      if (groupExists) {
        return new HTTPErrorResponse([ERROR_CODES.GROUP_EXISTS]);;
      }
      let newGroup = await GroupsModel.addGroup(group);
      responseBody = new HTTPSuccessResponse(newGroup);

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: error.code, message: error.message }]);
    }
    return responseBody;
  }


  async editGroup(group: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {
      const groupExists = await GroupsModel.getGroupById(group._id);

      if (groupExists) {
        const updatedGroup = await GroupsModel.updateGroup(group);
        responseBody = new HTTPSuccessResponse(updatedGroup);
      }else{
        responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_GROUP_ID]);;

      }

    } catch (error) {
      console.log(JSON.stringify(error));
      responseBody = new HTTPErrorResponse([{ code: error.code, message: error.message }]);
    }
    return responseBody;
  }



}
