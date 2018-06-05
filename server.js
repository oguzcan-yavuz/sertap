'use strict';

require('dotenv').load();
const express = require('express');
const logger = require('morgan');
const router = require('./app/routes/index.js');
const PORT = process.env.PORT || 3000;

let app = express();

app.use(logger('dev'));
app.use(router);
app.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});
