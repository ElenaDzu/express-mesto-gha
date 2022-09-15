const router = require('express').Router();

const { validateCreateCards, validateDeleteCard, validatePutLike, validateDeleteLike } = require('../validators');

const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', auth, getCards);

router.post(
  '/',
  validateCreateCards,
  auth,
  createCard,
);

router.delete(
  '/:cardId',
  validateDeleteCard,
  auth,
  deleteCard,
);

router.put(
  '/:cardId/likes',
  validatePutLike,
  auth,
  putLike,
);

router.delete(
  '/:cardId/likes',
  validateDeleteLike,
  auth,
  deleteLike,
);

module.exports = router;
