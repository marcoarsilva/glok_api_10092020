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

router.put('/:id', function(req, res, next) {
    var newDevice = new Device({
        name: req.body.name,
        mot: req.body.mot,
        notes: req.body.notes
      });


    Device
        .findOneAndUpdate({_id: req.params.id}, newDevice)
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Successfully updated device',
                device_updated: newDevice
            });
        })    
});

module.exports = router;