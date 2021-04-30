const mongoose = require('mongoose');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
require('dotenv').config({ path: `${__dirname}/.env.local` });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const Category = require('./models/category');

const server = livereload.createServer();
server.watch(`${__dirname}/public`);

const app = express();
app.use(connectLivereload());

server.server.once('connection', () => {
  setTimeout(() => {
    server.refresh('/');
  }, 100);
});

// Set up mongoose
const mongoDB = `mongodb+srv://Aurelie:${process.env.MONGODB_PASSWORD}@cluster0.t6dqf.mongodb.net/pixel_mart?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  Category.find({}, 'name').exec((err, result) => {
    if (err) return next(err);
    res.locals.categories = result;
    next();
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
