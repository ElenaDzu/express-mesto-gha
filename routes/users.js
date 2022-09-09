const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getUser,
  getUserId,
  patchUserId,
  patchAvatar,
} = require('../controllers/users');

router.get('/', auth, getUser);

router.get('/:userId', auth, getUserId);

router.patch('/me', auth, patchUserId);

router.patch('/me/avatar', auth, patchAvatar);

module.exports = router;
