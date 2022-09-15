const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const NotFound404 = require('./Errors/NotFound404');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(routes);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.all('/*', () => {
  throw new NotFound404();
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).json({ message: err.message });
  next();
});

app.listen(PORT);
