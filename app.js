require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/authRouter');
var apiRouter = require('./routes/apiRouter');
const authMiddleware = require('./middleware/authMiddleware').authMiddleware

var app = express();
const cors = require('cors')
require('./models/connection')

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api', authMiddleware, apiRouter);

module.exports = app;
