const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  getUser,
  getUserId,
  patchUserId,
  patchAvatar,
} = require('../controllers/users');

router.get('/', auth, getUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object().keys({}),
    query: Joi.object().keys({}),
  }),
  auth,
  getUserId,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  auth,
  patchUserId,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .regex(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        ),
    }),
  }),
  auth,
  patchAvatar,
);

module.exports = router;
