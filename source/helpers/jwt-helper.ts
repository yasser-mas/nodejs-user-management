import { classToPlain } from 'class-transformer';
import { sign, verify } from 'jsonwebtoken';
import { TokenPayload } from '../dto/token-payload';

export class JwtHelper {
  private static _jwtHelper = new JwtHelper();
  private JWT_ACCESS_SECRET_KEY =  process.env.JWT_ACCESS_SECRET_KEY; 
  private JWT_REFRESH_SECRET_KEY =  process.env.JWT_REFRESH_SECRET_KEY; 
  private constructor() {}

  static getInstance() {
    return JwtHelper._jwtHelper;
  }

  getAccessToken(user: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        expiresIn: '1h',
        issuer: 'node-um.com',
        audience: user.username,
      };
      return sign(
        classToPlain(user),
        String(this.JWT_ACCESS_SECRET_KEY),
        options,
        (err, token) => {
          if (err) {
            console.log(err.message);
            reject('Can not generate token ');

            return;
          }
          resolve(token);
        }
      );
    });
  }

  getAccessTokenPayload(authHeader: string): Promise<TokenPayload> {
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    return new Promise((resolve, reject) => {
      verify(
        token,
        String(this.JWT_ACCESS_SECRET_KEY),
        (err, payload: any) => {
          if (err) {
            console.log(err.message);
            reject(err);
          }
          resolve(payload);
        }
      );
    });
  }

  getRefreshToken(user: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        expiresIn: '1y',
        issuer: 'node-um.com',
        audience: user.username,
      };
      return sign(
        classToPlain(user),
        String(this.JWT_REFRESH_SECRET_KEY),
        options,
        (err, token) => {
          if (err) {
            console.log(err.message);
            reject('Can not generate token ');

            return;
          }
          resolve(token);
        }
      );
    });
  }


  getRefreshTokenPayload(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      verify(
        token,
        String(this.JWT_REFRESH_SECRET_KEY),
        (err, payload: any) => {
          if (err) {
            console.log(err.message);
            reject(err);
          }
          resolve(payload);
        }
      );
    });
  }
}
