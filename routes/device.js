var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Device = require('../models/device');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});