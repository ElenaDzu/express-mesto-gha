const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/users');
const {
  NOT_FOUND,
} = require('./utils/errors');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);

app.post('/signup', createUser);

app.use('/users', routes);

app.use('/cards', require('./routes/cards'));

app.all('/*', (req, res) => res.status(NOT_FOUND).send({ message: 'Ресурс не найден' }));

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT);
