const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};
module.exports.createMovie = (req) => {
  const {
    country,
    director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  });
};
module.exports.deleteSavedMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById({ _id: movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('movie is not found');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Not authorized to remove');
      } else {
        Movie.remove({ _id: movieId })
          .then((specificMovie) => {
            if (!specificMovie) {
              throw new NotFoundError('movie is not found');
            } else {
              res.send({ message: 'movie deleted' });
            }
          })
          .catch((specificMovieErr) => {
            if (specificMovieErr.name === 'CastError') {
              next(new BadRequestError('Wrong input data'));
            } else {
              next(specificMovieErr);
            }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Wrong input data'));
      } else {
        next(err);
      }
    });
};
