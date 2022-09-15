const express = require('express');

const app = express();
const router = require('express').Router();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { validateLogin, validateCreateUser } = require('./validators');

app.post('/signin', validateLogin, login);

app.post('/signup', validateCreateUser, createUser);

router.use(auth);

app.use('/users', userRouter);

app.use('/cards', cardRouter);
