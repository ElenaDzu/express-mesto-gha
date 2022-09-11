const router = require('express').Router();

const auth = require('../middlewares/auth');

const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', auth, getCards);

router.post('/',  celebrate({
  body: Joi.object().keys({
   name: Joi.string().required().min(2).max(30),
   link: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
  })
}), auth, createCard);

router.delete('/:cardId', celebrate ({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), auth, deleteCard);

router.put('/:cardId/likes', celebrate ({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), auth, putLike);

router.delete('/:cardId/likes', celebrate ({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), auth, deleteLike);

module.exports = router;
