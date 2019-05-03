var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods");

var Device = require('../models/device');

router.get('/', methods.ensureToken ,function(req, res, next) {
  if(!req.payload.user.isSuperAdmin){
    Device
    .find({company: req.payload.user.company})
    .then(device => {
        res.send(device);
    })
    .catch(err => {
        res.status(500).json({
            message: 'Server error',
            error: err
        });
    })   
  } else {
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
  }
});

router.delete('/:id', methods.ensureToken ,function(req, res, next) {
    if(!req.payload.user.isSuperAdmin){
      Device
      .findByIdAndRemove(req.params.id)
      .then(device => {
          res.send(device);
      })
      .catch(err => {
          res.status(500).json({
              message: 'Server error',
              error: err
          });
      })   
    } else {
      Device
      .delete({})
      .then(device => {
          res.send(device);
      })
      .catch(err => {
          res.status(500).json({
              message: 'Server error',
              error: err
          });
      })   
    }
  });

router.put('/:id',methods.ensureToken ,function(req, res, next) {
    if(!req.payload.user.isSuperAdmin){
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
        }).catch(err => {
                res.status(500).json({
                    message: 'Server error',
                    error: err
                });
            })    
    } else {
        var newDevice = new Device({
            name: req.body.name,
            mot: req.body.mot,
            notes: req.body.notes,
            company: req.body.company
          });
    
        Device
            .findOneAndUpdate({_id: req.params.id}, newDevice)
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Successfully updated device',
                    device_updated: newDevice
                });
            }).catch(err => {
                res.status(500).json({
                    message: 'Server error',
                    error: err
                });
            })   
    }
 
});

module.exports = router;