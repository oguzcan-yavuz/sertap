'use strict';

require('dotenv').load();
const express = require('express');
const logger = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const router = require('./app/routes/index.js');
const PORT = process.env.PORT || 3000;

let app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended:true }));
app.use(router);
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
