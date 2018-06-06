'use strict';

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = require("express").Router();
const music = require('../api/music.js');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', upload.single('soundBlob'), music.getMusic);

router.get('/stream/:videoId', music.streamMusic);

module.exports = router;
