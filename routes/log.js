var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Sigfox = require('../models/sigfox');
var Device = require('../models/device');

function addToDeviceList(company, device, lat, lng, bat, temp, time){
  Device.find({device: device})
  .then(result => {
    if(result != ""){
      
      Device.findOneAndUpdate({device: device}, {lat: lat, lng: lng, bat: bat, temp: temp})
      .then(result => {
        console.log(result)
      })
      .catch(err => console.log(err))
    } else {
      console.log("create new");

      var newDevice = new Device({
        _id: mongoose.Types.ObjectId(),
        device: device,
        lat: lat, 
        lng: lng, 
        bat: bat, 
        temp: temp
      });

      newDevice.save().then(result => {
        console.log('Added ' + result);
      })
    }
 
  })
  .catch(err =>{console.log(err)});



  // device.save().then( result => {
  //   console.log(result);
  // })
}

router.get('/', function(req, res, next) {
  Sigfox
  .find({})
  .then(entry => {
      res.send(entry);
  })
});

router.get('/:device', function(req, res, next) {
  Sigfox
  .find({device: req.params.device})
  .then(result => {
      res.send(result);
  })
  .catch(err => {
    res.status(500).json({
        message: 'Server error',
        error: err
    });
})
});

router.post('/',  function(req, res, next) {
  var newEntry = new Sigfox({
    _id: mongoose.Types.ObjectId(),
    device: req.body.device,
    payload: req.body.payload,
    time: req.body.time,
    lat: req.body.lat,
    lng: req.body.lng
  });

  newEntry
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
          message: req.body.device + ' entry successfully added',
          company_created: newEntry
      });

      addToDeviceList("company",req.body.device,req.body.lat, req.body.lng,'0','0',req.body.time);
    })
    .catch(err => { 
      console.log(err);
      res.status(500).json({
          message: 'Couldn\'t save entry',
          error: err
      });
  });
});


module.exports = router;