const router = require('express').Router();

const { validateGetUserId, validatePatchUserId, validatePatchAvatar } = require('../middlewares/validators');

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
  validateGetUserId,
  auth,
  getUserId,
);

router.patch(
  '/me',
  validatePatchUserId,
  auth,
  patchUserId,
);

router.patch(
  '/me/avatar',
  validatePatchAvatar,
  auth,
  patchAvatar,
);

module.exports = router;
