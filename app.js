const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '630a1400b52e11e5e20ad741',
  };

  next();
});
app.use('/users', routes);

app.use('/cards', require('./routes/cards'));

app.listen(PORT);
