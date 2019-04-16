import express from 'express';
import HttpException from '../lib/http/http-exception-model';

export function erroHandler(
  err: HttpException,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.error(err.message);
  res.status(404).send('404 Not Found!');
}
