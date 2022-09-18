const Card = require('../models/card');
const BadRequest400 = require('../Errors/BadRequest400');
const InternalServerError500 = require('../Errors/InternalServerError500');
const NotFound404 = require('../Errors/NotFound404');
const Forbidden403 = require('../Errors/Forbidden403');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound404('Объект не найден'));
        return;
      }
      if (card && card.owner.toString() === req.user._id) {
        Card.findByIdAndDelete(card._id.toString(), (err, doc) => {
          if (err) throw new Error(err);
          res.send({ data: doc });
        });
        return;
      }
      next(new Forbidden403('Попытка удалить чужую карточку'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
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
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
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
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};
