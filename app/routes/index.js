'use strict';

const router = require("express").Router();
const speechToText = require('../api/music.js').speechToText;

router.get('/', async (req, res) => {
  speechToText('/home/yvz/yvz-dev/sertap/data/2.flac');
  res.send("server is up!");
});

module.exports = router;
