const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Conflict409 = require('../Errors/Confliсt409');
const BadRequest400 = require('../Errors/BadRequest400');
const InternalServerError500 = require('../Errors/InternalServerError500');
const NotFound404 = require('../Errors/NotFound404');
const Unauthorized401 = require('../Errors/Unauthorized 401');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        password: user.password,
      },
    }))
    .catch(() => {
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound404('Объект не найден');
      }
      res.status(200).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          password: user.password,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest400('Неправильный запрос');
      }
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });
        res.cookie('token', token, { maxAge: 3600 * 24 * 7, httpOnly: true });
        res.status(200).send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          },
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          throw new Conflict409('Введен существующий емайл');
        }
        if (err.name === 'ValidationError') {
          throw new BadRequest400('Неправильный запрос');
        }
        throw new InternalServerError500('На сервере произошла ошибка');
      })
      .catch(next);
  });
};

module.exports.patchUserId = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    throw new BadRequest400('Неправильный запрос');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFound404('Объект не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest400('Неправильный запрос');
      }
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new BadRequest400('Неправильный запрос');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFound404('Объект не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest400('Неправильный запрос');
      }
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new Unauthorized401('Неверный логин, пароль, токен'),
        );
      }

      return { user, matched: bcrypt.compare(password, user.password) };
    })
    .then(({ user, matched }) => {
      if (!matched) {
        return Promise.reject(
          new Unauthorized401('Неверный логин, пароль, токен'),
        );
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.cookie('token', token, { maxAge: 3600 * 24 * 7, httpOnly: true });

      res.send({ message: 'Всё верно!' });
      return Promise.resolve();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    })
    .catch(next);
};
