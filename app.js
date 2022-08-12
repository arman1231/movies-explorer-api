const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');

const options = {
  origin: [
    'localhost:3000',
    'http://localhost:3000',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const routes = require('./routes');
const { DB, PORT } = require('./config');

const app = express();
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use('*', cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(DB);
app.use(cookieParser());
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
