const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const routes = require('./routes/users');
const NotFound404 = require('./Errors/NotFound404');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use('/users', routes);

app.use('/cards', require('./routes/cards'));

app.all('/*', () => {
  throw new NotFound404();
});

app.use(errors());

app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT);
