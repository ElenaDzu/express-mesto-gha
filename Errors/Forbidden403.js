class Forbidden403 extends Error {
  constructor(message = 'Попытка удалить чужую карточку') {
    super(message);
    this.statusCode = 403;
  }
}
module.exports = Forbidden403;
