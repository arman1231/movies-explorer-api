const { ERROR_INTERNAL_SERVER_ERROR } = require('../errors/errorCodes');

module.exports = (err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_INTERNAL_SERVER_ERROR
        ? 'Internal Server Error'
        : message,
    });
  next();
};
