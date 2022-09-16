const Card = require('../models/card');
const BadRequest400 = require('../Errors/BadRequest400');
const InternalServerError500 = require('../Errors/InternalServerError500');
const NotFound404 = require('../Errors/NotFound404');
const Forbidden403 = require('../Errors/Forbidden403');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest400('Неправильный запрос');
      }
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound404('Объект не найден'));
        return;
      }
      if (card && card.owner === req.user._id) {
        res.send({ data: card });
        Card.findByIdAndDelete(card._id);
        return;
      }
      throw new Forbidden403('Попытка удалить чужую карточку');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest400('Неправильный запрос');
      }
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.putLike = (req, res, next) => {
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
      next(new NotFound404('Объект не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest400('Неправильный запрос');
      }
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
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
      next(new NotFound404('Объект не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest400('Неправильный запрос');
      }
      throw new InternalServerError500('На сервере произошла ошибка');
    })
    .catch(next);
};
