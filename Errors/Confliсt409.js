class Conflict409 extends Error {
  constructor(message = 'Существующий емайл') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = Conflict409;
