'use strict';

const router = require("express").Router();

router.get('/', (req, res) => {
  res.send("server is up!");
});

module.exports = router;