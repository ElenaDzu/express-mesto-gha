class NotFound404 extends Error {
  constructor(message = 'Объект не найден') {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = NotFound404;
