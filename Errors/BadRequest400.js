class BadRequest400 extends Error {
  constructor(message = 'Неправильный запрос') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = BadRequest400;
