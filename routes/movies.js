const router = require('express').Router();
const {
  getSavedMovies, createMovie, deleteSavedMovie,
} = require('../controllers/movies');

router.get('/', getSavedMovies);
router.post('/', createMovie);
router.delete('/:_id', deleteSavedMovie);

module.exports = router;
