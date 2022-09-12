const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Conflict409 = require('../Errors/Confliсt409');
const BadRequest400 = require('../Errors/BadRequest400');
const InternalServerError500 = require('../Errors/InternalServerError500');
const NotFound404 = require('../Errors/NotFound404');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      throw new InternalServerError500();
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound404();
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest400();
      }
      throw new InternalServerError500();
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.cookie('token', token, { maxAge: 3600 * 24 * 7, httpOnly: true });
        res.send({ data: user });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new Conflict409());
        } else if (err.name === 'ValidationError') {
          next(new BadRequest400());
        } else {
          next(err);
        }
      });
  });
};

module.exports.patchUserId = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    throw new BadRequest400();
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
      throw new NotFound404();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest400();
      }
      throw new InternalServerError500();
    })
    .catch(next);
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new BadRequest400();
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
      throw new NotFound404();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest400();
      }
      throw new InternalServerError500();
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return { user, matched: bcrypt.compare(password, user.password) };
    })
    .then(({ user, matched }) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, { maxAge: 3600 * 24 * 7, httpOnly: true });

      res.send({ message: 'Всё верно!' });
      return Promise.resolve();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    })
    .catch(next);
};
