const { MONGO_DUPLICATE_ERROR } = require('./errorCodes');

class MongoDuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = MONGO_DUPLICATE_ERROR;
  }
}

module.exports = MongoDuplicateError;
