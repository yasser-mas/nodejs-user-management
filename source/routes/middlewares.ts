import express from 'express';
import HTTPAuthErrorResponse from '../lib/http/http-error-auth';
import { AuthController } from '../controllers/auth-controller';
import { JwtHelper } from '../helpers/jwt-helper';
import { TokenPayload } from '../dto/token-payload';

const authController = new AuthController();

export async function httpInterceptor(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.header('authorization');
  let jwtHelper : JwtHelper = JwtHelper.getInstance();

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

        const userData : TokenPayload  = await jwtHelper.getAccessTokenPayload(token);

        // Store parsed token and user data to be used in route controller
        res.locals.tokenData = parsedToken;
        res.locals.userData = userData;
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
