var express = require('express');
var router = express.Router();
var methods = require("../methods");
var moment = require('moment');
var Device = require('../models/device');
var deviceRecord = require('../models/deviceRecord');
var mongoose = require('mongoose');


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

router.get('/:device', methods.ensureToken ,function(req, res, next) {
    if(!req.payload.user.isSuperAdmin){
      Device
      .findOne({company: req.payload.user.company, device: req.params.device})
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
      .findOne({device: req.params.device})
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

router.get('/mot/:date1/:date2', methods.ensureToken ,function(req, res, next) {
    console.log()
    var startDate = moment(new Date(req.params.date1))
    var endDate   = moment(new Date(req.params.date2))

    if(req.payload.user.isSuperAdmin){
        Device
        .find({mot: { '$gte': startDate, '$lte': endDate }})
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
        .find({company: req.payload.user.company, mot: { '$gte': startDate, '$lte': endDate }})
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
                logDeviceChange(req.payload.user._id,result._id, 'generic')
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
                logDeviceChange(req.payload.user._id,result._id, 'generic');
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
router.delete('/:id', methods.ensureToken ,function(req, res, next) {
    if(req.payload.user.isSuperAdmin){
        Device
            .findByIdAndRemove(req.params.id)
            .then(device => {
                if(!device){
                    res.status(404).json({
                        message: 'No device with id ' + req.params.id,
                    });
                } else {
                    res.status(202).json({
                        message: 'Successfuly deleted device',
                        device_deleted: device
                    });
                }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
    } else {
        res.status(403).json({
            message: 'You dont have enough permissons',
        });
    }
  });


const logDeviceChange = (user, device , modifier) => {
    var newLog = new deviceRecord({
        _id: mongoose.Types.ObjectId(),
        user: user,
        device: device,
        modifier: modifier,
        timestamp: Date.now()
    });

    newLog.save().then( res => {
        console.log(res)
    })
}

module.exports = router;
