const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('express').Router();
const routes = require('./routes/users');
const NotFound404 = require('./Errors/NotFound404');
const { login, createUser } = require('./controllers/users');
const { validateLogin, validateCreateUser } = require('./validators');

const { PORT = 3000 } = process.env;

const app = express();
const auth = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', validateLogin, login);

app.post('/signup', validateCreateUser, createUser);

router.use(auth);
app.use('/users', routes);

app.use('/cards', require('./routes/cards'));

app.all('/*', () => {
  throw new NotFound404();
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).json({ message: err.message });
  next();
});

app.listen(PORT);
