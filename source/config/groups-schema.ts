import Joi from 'joi';

const REQUIRED_STRING = Joi.string().trim().required();
const REQUIRED_NUMBER = Joi.number().required();
const ID = Joi.string().required();


export const GET_ALL_GROUPS = Joi.object()
  .keys({
    limit: REQUIRED_NUMBER.integer().min(0),
    offset: REQUIRED_NUMBER.integer().min(0),
    sortBy: REQUIRED_STRING,
    sortOrder: REQUIRED_STRING,
  }).required();



const PERMISSIONS_SCHEMA = Joi.object({
  _id: ID,
  name: Joi.string(),
  path: Joi.string(),
  method: Joi.string(),
});

export const ADD_GROUP_SCHEMA = Joi.object({
  name: REQUIRED_STRING,
  permissions: Joi.array().items(
    Joi.alternatives(
      Joi.string(),
      PERMISSIONS_SCHEMA,
    ),
  ),
});


export const EDIT_GROUP_SCHEMA = Joi.object({
  _id: ID,
  name: REQUIRED_STRING,
  permissions: Joi.array().items(
    Joi.alternatives(
      Joi.string(),
      PERMISSIONS_SCHEMA,
    ),
  ),
});

