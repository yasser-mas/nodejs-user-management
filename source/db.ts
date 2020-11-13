import mongoose, { Mongoose, Connection } from 'mongoose';

export default class DBConnection {
  /*
   * Load DB Options from .env file or set defaults if param not exists
   */
  DB_OPTIONS = {
    useNewUrlParser: Boolean(process.env.USE_NEW_URL_PARSER) || true,
    useCreateIndex: true,
    autoReconnect: Boolean(process.env.AUTO_RECONNECT) || true,
    poolSize: Number(process.env.POOL_SIZE) || 50,
    reconnectInterval: Number(process.env.RECONNECT_INTERVAL) || 1000,
    reconnectTries: Number(process.env.RECONNECT_TRIES) || 30
  };

  db: Mongoose = mongoose;
  connection: Connection;

  constructor() {
    this.db.Promise = Promise;
    this.db.set('useFindAndModify', false);
    this.db.set('ensureIndex', false);

    this.db.connect(
      process.env.DB_URL || 'mongodb://localhost:27017/usermanagement',
      this.DB_OPTIONS
    );
    this.connection = this.db.connection;

    this.connection.on(
      'error',
      console.error.bind(console, 'connection error:')
    );

    this.connection.on('disconnected', function() {
      console.log('DB disconnected');
    });

    this.connection.on('reconnect', function() {
      console.log('DB reconnect');
    });
  }

}
