import jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const {
    headers: {
      authorization
    }
  } = req;

  if (authorization) {
    const authorizationParts = authorization.split(' ');

    if (authorizationParts[0].toLowerCase() === 'token') {
      return authorizationParts[1];
    }
  }

  return null;
};

const expressJwtParams = {
  secret: 'secret',
  userProperty: 'payload',
  getToken: getTokenFromHeaders,
};

const auth = {
  required: jwt(expressJwtParams),
  optional: jwt({
    ...expressJwtParams,
    credentialsRequired: false,
  }),
};

export default auth;
