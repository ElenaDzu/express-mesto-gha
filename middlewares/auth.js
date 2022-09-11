const jwt = require('jsonwebtoken');
const Unauthorized401 = require('../Errors/Unauthorized401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized401();
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new Unauthorized401();
  }

  req.user = payload;

  next();
};
