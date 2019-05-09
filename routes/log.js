var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods");
var moment = require('moment');
var classifyPoint = require("robust-point-in-polygon");
var Sigfox = require('../models/sigfox');
var Device = require('../models/device');
var Company = require('../models/company');
var Area = require('../models/area');
var History = require('../models/history');

function getBinaryFrame(payload) {
  var bytes = payload.match(/.{1,2}/g);
  var binaryString = '';
  bytes.forEach(function (byte) {
    binaryString += getBinaryFromHex(byte);

  });
  if (!binaryString.match(/^([0-9]*)$/)) {
    return null;
  }
  return binaryString;
  
}
function getBinaryFromHex(byte) {
  var num = Number(parseInt(byte, 16));
  if (isNaN(num)) {
    return null;
  }
  var binary = num.toString(2);

  //Fill the byte with zeros
  while (binary.length < 8) {
    binary = '0' + binary;
  }

  return binary;
}
function getDecimalCoord(sigfoxFrame) {
  var degrees = Math.floor(sigfoxFrame);
  var minutes = sigfoxFrame % 1 / 60 * 100;
  minutes = Math.round(minutes * 10000) / 10000;
  return degrees + minutes;
}
function batteryToPercent(battery, voltage) {
  if (battery.length <= 3){
    
    var h = parseInt(battery) + parseInt(voltage);
    var p = parseFloat((h*15)/1000); 
    
    if(p > 2.54) {
      let bat =(((p - 2.54) * 100) / 1.66).toFixed(0);
      bat > 100 ? p = 100 : p = bat;
    } else {
        p = 0;
    }
  
    return p
  } 
  return "ERR"
}
function temperatureToPercent(temp) {
  return parseFloat((temp*15)/100)
}
function addToDeviceList(device, lat, lng, bat, temp){
  Device.find({device: device})
  .then(result => {
    if(result != ""){
      Device.findOneAndUpdate({device: device}, {lat: lat, lng: lng, bat: bat, temp: temp, last_seen: Date.now()})
      .then(result => {
        isInsideGeofence(result.device, result.company, result.lat, result.lng);
      })
      .catch(err => console.log(err))
    } else {
      var newDevice = new Device({
        _id: mongoose.Types.ObjectId(),
        device: device,
        lat: lat, 
        lng: lng, 
        bat: bat, 
        temp: temp,
        last_seen: Date.now()
      });

      newDevice.save().then(result => {
        isInsideGeofence(result.device, result.company, result.lat, result.lng);
        console.log('Added ' + result);
      }).catch(err => console.log(err));
    }
 
  })
  .catch(err =>{console.log(err)});
}
function isInsideGeofence(device, company, lat, lng) {
  var latLngs = [];
  var lats = [];
  var longs = [];

  Company.findOne({_id: company}).then(companyItem => {
    companyItem.areas.forEach(areas => {
        Area.findOne({name: areas}).then( area => {
          area.points.forEach( point => {
            latLngs.push([point.lat,point.lng]);
            lats.push([point.lat]);
            longs.push([point.lng]);
          });

          if(classifyPoint(latLngs ,[lat, lng]) == -1){
            console.log(device + "|" + "INSIDE" + ">" + area.name  );
          } else {
            console.log(device + "|" + "OUTSIDE" + ">" + area.name  );
          }

           latLngs = [];
           lats = [];
           longs = [];
        });
    });
  });
}
function saveGeofenceLog() {

}
router.get('/', methods.ensureToken ,function(req, res, next) {
  Sigfox
  .find({})
  .sort({_id:-1})
  .then(entry => {
      res.send(entry);
  })
  .catch(err => {
    res.status(500).json({
        message: 'Server error',
        error: err
    });
  })
});
router.get('/:device', methods.ensureToken ,function(req, res, next) {
  Sigfox
  .find({device: req.params.device})
  .sort({_id:-1})
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
router.get('/:device/:limit', methods.ensureToken ,function(req, res, next) {
  Sigfox
  .find({device: req.params.device})
  .sort({_id:-1})
  .limit(parseInt(req.params.limit))
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
router.get('/:device/:date1/:date2', methods.ensureToken ,function(req, res, next) {
  var startDate = moment(new Date(req.params.date1)) 
  var endDate   = moment(new Date(req.params.date2))

  Sigfox.find({"device": req.params.device,"time": { '$gte': startDate, '$lte': endDate }}).then(result=> {
    console.log(result);
    res.send(result);
  });
});
router.post('/', function(req, res, next) {
  var newEntry = new Sigfox({
    _id: mongoose.Types.ObjectId(),
    device: req.body.device,
    payload: req.body.payload,
    time: Date.now(),
    lat: req.body.lat,
    lng: req.body.lng,
    voltage: req.body.voltage,
    acqspeed: req.body.acqspeed,
    battery: batteryToPercent(req.body.battery, req.body.voltage),
    temp: temperatureToPercent(req.body.temp),
  });

  newEntry
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
          message: req.body.device + ' entry successfully added',
          company_created: newEntry
      });

      var framePattern = /(.{1})(.{31})(.{1})(.{31})(.{2})(.{2})(.{4})(.{4})(.{4})(.{8})(.{8})/;
      var binaryFrame = getBinaryFrame(req.body.payload);
      var frame = framePattern.exec(binaryFrame);
    
      var lng = (frame[3] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[4], 2) / Math.pow(10, 6));
      var lat = (frame[1] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[2], 2) / Math.pow(10, 6));

      addToDeviceList(req.body.device, lat, lng,  batteryToPercent(req.body.battery, req.body.voltage), temperatureToPercent(req.body.temp), req.body.time);
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