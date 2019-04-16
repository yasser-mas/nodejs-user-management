import { ErrorObject } from './http/http-error-response';
import Joi from 'joi';

export function getListOfErrors(schemaValidator: Joi.ValidationResult<any>) {
  let errors: ErrorObject[] = [];

  try {
    errors = schemaValidator.error.details.map(detail => {
      return { code: 400, message: detail.message };
    });
  } catch (error) {
    console.log(error);
  }

  return errors;
}
