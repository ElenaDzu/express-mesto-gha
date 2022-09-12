const jwt = require('jsonwebtoken');
const Unauthorized401 = require('../Errors/Unauthorized 401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new Unauthorized401(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return new Unauthorized401(res);
  }

  req.user = payload;

  next();
};

/*
const Unauthorized401 = require('../Errors/Unauthorized 401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized401(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new Unauthorized401(res);
  }

  req.user = payload;

  next();
};
*/
