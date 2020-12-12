import { UserModel, IUserDocument } from './../models/users-model';
import HTTPErrorResponse from './../lib/http/http-error-response';
import HTTPSuccessResponse from '../lib/http/http-success-response';
import { hash, compare } from 'bcrypt';
import { ERROR_CODES } from '../lib/error-codes';

export class UserController {

  constructor() {
  }

  async getAllUsers(body: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;

    try {

      const allUsers = UserModel.getAllUsers(body);
      const count = UserModel.countUsers(body);

      responseBody = new HTTPSuccessResponse({ list: await allUsers, count: await count });


    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: 500, message: error.message }]);
    }
    return responseBody;

  }


  async getUserById(body: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {

      const user = await UserModel.getUserById(body._id);

      responseBody = new HTTPSuccessResponse(user);

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: 400, message: error.message }]);
    }
    return responseBody;

  }


  async deleteUserById(body: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {
      const user = await UserModel.getUserById(body._id);
      if(!user){
        return new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]);
      }
      await UserModel.softDelete(body._id);
      responseBody = new HTTPSuccessResponse({});

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: 500, message: error.message }]);
    }
    return responseBody;

  }


  async addUser(user: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {

      const hashedPassword = await hash(user.password, 10);

      user.password = hashedPassword;

      const usernameExists = await UserModel.getUserByUsername(user.username);

      if (usernameExists) {
        return responseBody = new HTTPErrorResponse([ERROR_CODES.USER_EXISTS]);
      }

      let newUser = await UserModel.addUser(user);
      // newUser.password = '';
      responseBody = new HTTPSuccessResponse(newUser);

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: error.code || 500, message: error.message }]);
    }
    return responseBody;
  }


  async getUserByToken(token: string): Promise<IUserDocument | null> {

    const user = await UserModel.getUserByToken(token);

    return user;

  }


  async editUser(user: IUserDocument): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {
      const userExits = await UserModel.getUserById(user._id);
      if(!userExits){
        return new HTTPErrorResponse([ERROR_CODES.INVALID_USER_ID]);
      }
      const updatedUser = await UserModel.updateUser(user);
      
      responseBody = new HTTPSuccessResponse(updatedUser);

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: 500, message: error.message }]);
    }
    return responseBody;
  }




  async changePassword(user: any): Promise<HTTPErrorResponse | HTTPSuccessResponse> {

    let responseBody: HTTPErrorResponse | HTTPSuccessResponse;
    try {
      const userData = await UserModel.getUserById(user._id);

      if (userData && await compare(user.oldPassword, <string> userData.password)) {

        const hashedPassword = await hash(user.newPassword, 10);

        user.newPassword = hashedPassword;

        const updatedUser = await UserModel.changePassword(user);
        responseBody = new HTTPSuccessResponse({});
      } else {

        responseBody = new HTTPErrorResponse([ERROR_CODES.INVALID_OLD_PASS]);
      }

    } catch (error) {
      console.log(error);
      responseBody = new HTTPErrorResponse([{ code: error.code || 500, message: error.message }]);
    }
    return responseBody;
  }

}
