class InternalServerError500 extends Error {
  constructor(message = 'На сервере произошла ошибка') {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = InternalServerError500;
