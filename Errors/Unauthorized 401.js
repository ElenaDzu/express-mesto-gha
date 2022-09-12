class Unauthorized401 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = 'Неверный логин, пароль, токен';
  }
}

module.exports = Unauthorized401;
