const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
// const { urlRegEx } = require('../middlewares/validation');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Incorect email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    default: 'User name is not specified',
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Wrong input data'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Wrong input data'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
