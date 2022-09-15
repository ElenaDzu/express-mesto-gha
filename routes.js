const router = require('express').Router();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { validateLogin, validateCreateUser } = require('./validators');
const NotFound404 = require('./Errors/NotFound404');

router.post('/signin', validateLogin, login);

router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);

router.use('/cards', cardRouter);

router.all('/*', () => {
  throw new NotFound404('Маршрут не найден');
});
