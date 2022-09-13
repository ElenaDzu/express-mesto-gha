class BadRequest400 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = BadRequest400;
