const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser, logout } = require('../controllers/users');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will fall NOW');
  }, 0);
});
router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);
router.use(auth);
router.post('/signout', logout);
router.use('/movies', movieRouter);
router.use('/users', userRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Page not found'));
});
module.exports = router;
