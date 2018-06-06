'use strict';

const multer = require('multer');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const upload = multer({ dest: path.join(appDir, 'public', 'uploads') });
const router = require("express").Router();
const playMusic = require('../api/music.js');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', upload.single('upl'), playMusic);

module.exports = router;
