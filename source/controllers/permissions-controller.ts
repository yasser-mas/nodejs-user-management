import HTTPErrorResponse from './../lib/http/http-error-response';
import HTTPSuccessResponse from '../lib/http/http-success-response';
import { PermissionsModel } from '../models/permissions-model';

export class PermissionsController {


  constructor() {
  }

  async getAllPermissions(): Promise<HTTPErrorResponse | HTTPSuccessResponse> {
    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    try {
      const allPermissions = await PermissionsModel.getAllPermissions();
      responseBody = new HTTPSuccessResponse({ list: allPermissions });

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: 500, message: error.message }]);
    }
    return responseBody;

  }

}
