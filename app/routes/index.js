'use strict';

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = require("express").Router();
const getMusic = require('../api/music.js').getMusic;
const streamMusic = require('../api/music.js').streamMusic;

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', upload.single('soundBlob'), getMusic);

router.get('/play', streamMusic);

module.exports = router;
