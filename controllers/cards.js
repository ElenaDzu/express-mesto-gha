const Card = require('../models/card');

const {
  BAD_REGUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');
//400,500
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
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
//400,500
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
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
//404
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(NOT_FOUND).send({ message: 'Объект не найден' }));
};
//400,404,500
module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      console.log(card);
      if (card) {
        res.send({ data: card });
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
//400,404,500
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
      if (err.name === 'ValidationError') {
        res.status(BAD_REGUEST).send({ message: 'Неправильный запрос' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
