var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Log = require('../models/log');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});