class Unauthorized401 extends Error {
  constructor(message = 'Неверный логин, пароль, токен') {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = Unauthorized401;
