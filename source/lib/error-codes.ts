export const ERROR_CODES = {
  USER_NAME_REQUIRED: { code: 400, message: 'Username Is Required !' },
  WRONG_USERNAME_OR_PASS: {
    code: 400,
    message: 'Wrong Username or Password !'
  },
  INVALID_TOKEN: { code: 401, message: 'Invalid Token !' },
  INVALID_TOKEN_OR_PASS: { code: 401, message: 'Invalid Token or Password !' },
  INVALID_USER_ID: { code: 400, message: 'Invalid User ID !' },
  USER_EXISTS: { code: 409, message: 'Username Already Exists !' },
  GROUP_EXISTS: { code: 409, message: 'Group Name Already Exists !' },
  GENERATE_TOKEN: { code: 409, message: 'Can\'t generate token !' },
  INVALID_OLD_PASS: { code: 400, message: 'Invalid Old Password!' },
  INVALID_GROUP_ID: { code: 400, message: 'Invalid Group ID !' },

  UNEXPECTED_ERROR: { code: 500, message: 'Unexpected Error !' }
};
