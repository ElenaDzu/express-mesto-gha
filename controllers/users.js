const User = require('../models/user');

const {
  BAD_REGUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REGUEST).send({ message: 'Неправильный запрос' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Объект не найден' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.postUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REGUEST).send({ message: 'Неправильный запрос' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.patchUserId = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    res.status(BAD_REGUEST).send({ message: 'Неправильный запрос' });
    return;
  }
  User.findByIdAndUpdate(req.params.userId, { name, about })
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND).send({ message: 'Объект не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REGUEST).send({ message: 'Неправильный запрос' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(BAD_REGUEST).send({ message: 'Неправильный запрос' });
    return;
  }
  User.findByIdAndUpdate(req.params.userId, { avatar })
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND).send({ message: 'Объект не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REGUEST).send({ message: 'Неправильный запрос' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
