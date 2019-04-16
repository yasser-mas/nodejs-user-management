export class CustomError extends Error {
  constructor(public code: number, public message: string) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
