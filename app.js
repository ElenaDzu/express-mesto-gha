const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errors());

app.use((err, req, res, next) => {
  let statusCode = 500;
  if (err.statusCode) {
    statusCode = err.statusCode;
  }
  res.status(statusCode).json({ message: err.message });
  next();
});

app.listen(PORT);
