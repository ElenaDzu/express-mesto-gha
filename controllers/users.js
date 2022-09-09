const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` })
    );
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Объект не найден" });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Некорректный id" });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(BAD_REQUEST).send({ message: "Неправильный запрос" });
          return;
        }
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка ${err.name}` });
      });
  });
};

module.exports.patchUserId = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    res.status(BAD_REQUEST).send({ message: "Неправильный запрос" });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND).send({ message: "Объект не найден" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Неправильный запрос" });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(BAD_REQUEST).send({ message: "Неправильный запрос" });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND).send({ message: "Объект не найден" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Неправильный запрос" });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};

module.exports.login = (req, res) => {
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
    });
};
