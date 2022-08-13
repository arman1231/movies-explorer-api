const router = require('express').Router();
const {
  validateCreateMovie,
  validateMovieId,
} = require('../middlewares/validation');
const {
  getSavedMovies, createMovie, deleteSavedMovie,
} = require('../controllers/movies');

router.get('/', getSavedMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:_id', validateMovieId, deleteSavedMovie);

module.exports = router;
