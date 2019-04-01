var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Device = require('../models/device');

router.get('/', function(req, res, next) {
  Device
  .find({})
  .then(device => {
      res.send(device);
  })
  .catch(err => {
      res.status(500).json({
          message: 'Server error',
          error: err
      });
  })
});

module.exports = router;