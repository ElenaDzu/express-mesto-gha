const router = require('express').Router();

const {
  validateCreateCards, validateDeleteCard, validatePutLike, validateDeleteLike,
} = require('../middlewares/validators');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post(
  '/',
  validateCreateCards,
  createCard,
);

router.delete(
  '/:cardId',
  validateDeleteCard,
  deleteCard,
);

router.put(
  '/:cardId/likes',
  validatePutLike,
  putLike,
);

router.delete(
  '/:cardId/likes',
  validateDeleteLike,
  deleteLike,
);

module.exports = router;
