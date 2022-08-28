const router = require('express').Router();

const {
  getUser,
  getUserId,
  postUsers,
  patchUserId,
  patchAvatar,
} = require('../controllers/users');

router.get('/', getUser);

router.get('/:userId', getUserId);

router.post('/', postUsers);

router.patch('/:userId/me', patchUserId);

router.patch('/:userId/me/avatar', patchAvatar);

module.exports = router;
