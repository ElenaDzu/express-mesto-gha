const Card = require('../models/card');

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильный запрос' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(NOT_FOUND).send({ message: 'Объект не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(NOT_FOUND).send({ message: 'Объект не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(NOT_FOUND).send({ message: 'Объект не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};
