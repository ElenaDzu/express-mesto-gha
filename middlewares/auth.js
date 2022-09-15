const jwt = require('jsonwebtoken');

const Unauthorized401 = require('../Errors/Unauthorized 401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    if (!req.cookie.token) { throw new Unauthorized401('Неверный логин, пароль, токен'); }
  }
  let token;

  if (authorization) {
    token = authorization.replace('Bearer ', '');
  } else {
    token = req.cookie.token;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new Unauthorized401('Неверный логин, пароль, токен');
  }

  req.user = payload;

  next();
};
