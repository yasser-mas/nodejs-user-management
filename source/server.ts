import { AuthRoutes } from './routes/auth-route';
import express from 'express';
import * as bodyParser from 'body-parser';
import * as Interceptors from './routes/middlewares';
import { erroHandler } from './routes/error-handler';
import { UserRoutes } from './routes/users-route';
import DBConnection from './db';
import { PermissionsRoutes } from './routes/permissions-route';
import { GroupsRoutes } from './routes/groups-route';
import { PermissionsList } from './lib/cached-permissions';
import { PermissionsModel } from './models/permissions-model';
import { GroupsModel } from './models/groups-model';
import { mongo, Mongoose } from 'mongoose';

/*
 * Creating Express App
 * Use HTTP Interceptor -> For Auth
 * Use Routes
 * Listen to bad requests and handle response
 * Conncting to DB
 * Start Server
 *
 */
export class Server {
  app: express.Application = express();
  db: DBConnection;
  usersRoutes: UserRoutes = new UserRoutes();
  authRoutes: AuthRoutes = new AuthRoutes();
  permissionsRoutes: PermissionsRoutes = new PermissionsRoutes();
  groupsRoutes: GroupsRoutes = new GroupsRoutes();

  constructor() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(Interceptors.httpInterceptor);

    this.constructRoutes();
    this.handleBadRequests();
    this.app.use(erroHandler);

    this.startServer();
  }

  constructRoutes() {
    this.app.get('/', (req, res) => {
      res.send('Welcome to Main Page');
    });
    this.app.use('/users', this.usersRoutes.router);
    this.app.use('/auth', this.authRoutes.router);
    this.app.use('/permissions', this.permissionsRoutes.router);
    this.app.use('/groups', this.groupsRoutes.router);
  }

  handleBadRequests() {
    this.app.all('*', (req, res) => {
      throw new Error('Page Not Found Error 404');
    });
  }

  startServer() {
    const PORT = Number(process.env.PORT) || 8082;
    const HOST = process.env.HOST || 'localhost';

    this.db = new DBConnection();

    this.db.connection.once('open', async () => {
      console.log('DB Connected');

      // Get All Permissions to use it in interceptor
      let permissionsList = await PermissionsModel.getAllPermissions();
      PermissionsList.setPermissionsList(permissionsList);

      // Start Server :)
      this.app.listen(PORT, HOST, () => {
        console.log(`Server Works on host ${HOST} and port ${PORT} `);
      });
    });
  }
}
