const router = require('express').Router();

const { validateGetUserId, validatePatchUserId, validatePatchAvatar } = require('../middlewares/validators');

const {
  getUsers,
  getUser,
  getUserId,
  patchUserId,
  patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.get(
  '/:userId',
  validateGetUserId,
  getUserId,
);

router.patch(
  '/me',
  validatePatchUserId,
  patchUserId,
);

router.patch(
  '/me/avatar',
  validatePatchAvatar,
  patchAvatar,
);

module.exports = router;
