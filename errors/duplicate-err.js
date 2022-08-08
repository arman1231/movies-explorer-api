const { ERROR_DUPLICATE } = require('./errorCodes');

class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_DUPLICATE;
  }
}

module.exports = DuplicateError;
