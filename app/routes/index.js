'use strict';

const router = require("express").Router();
const speechToText = require('../api/music.js').speechToText;

router.get('/', async (req, res) => {
  // speechToText('/home/yvz/yvz-dev/sertap/data/2018-06-05T22_47_47.035Z.wav');
  res.render('index');
});

router.post('/', (req, res) => {
  let path = req.body;
  console.log(path);
  // speechToText('/home/yvz/yvz-dev/sertap/data/2018-06-05T22_47_47.035Z.wav');
  // speechToText(path);
});

module.exports = router;
