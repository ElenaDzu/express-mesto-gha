const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).json({ message: err.message });
  next();
});

app.listen(PORT);
