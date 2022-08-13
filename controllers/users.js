const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const DuplicateError = require('../errors/duplicate-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`${req.user._id} not found`);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { name, email },
    },
    {
      runValidators: true,
      new: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`${req.user._id} not found`);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        .then(() => {
          res.status(201).send({
            data: {
              name, email,
            },
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Wrong input data'));
          } else if (err.code === 11000) {
            next(new DuplicateError('User already exist'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Not authorized');
      }
      const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.code === 401) {
        next(new UnauthorizedError('Not authorized'));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Cookie has been cleared' }).end();
};
