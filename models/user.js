// const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
// const { urlRegEx } = require('../middlewares/validation');
// const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Wrong email format',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    requred: true,
    minlength: 2,
    maxlength: 30,
    default: 'User',
  },
});

module.exports = mongoose.model('user', userSchema);
