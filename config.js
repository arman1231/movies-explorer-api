const {
  DB = 'mongodb://localhost:27017/moviesdb',
  PORT = 3009,
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  DB,
  NODE_ENV,
  PORT,
  JWT_SECRET,
};
