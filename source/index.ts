/* 
    Load .env File
*/
import dotenv from 'dotenv';
dotenv.config();

import { Server } from './server';

/*
 * Initiate Server
 */
new Server();
