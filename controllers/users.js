const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Conflict409 = require('../Errors/Confliсt409');
const BadRequest400 = require('../Errors/BadRequest400');
const InternalServerError500 = require('../Errors/InternalServerError500');
const NotFound404 = require('../Errors/NotFound404');
const Unauthorized401 = require('../Errors/Unauthorized401');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFound404('Объект не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      next(new InternalServerError500(err));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(200).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new Conflict409('Введен существующий емайл'));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new BadRequest400('Неправильный запрос'));
            return;
          }
          next(new InternalServerError500('На сервере произошла ошибка'));
        });
    })
    .catch(next);
};

module.exports.patchUserId = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
        return;
      }
      next(new NotFound404('Объект не найден'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
        return;
      }
      next(new NotFound404('Объект не найден'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest400('Неправильный запрос'));
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized401('Неверный пароль, логин или токен'));
    });
};
