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
var User = require('../models/user')
var conf = require('../configs.js');

function bin2dec(bin){
  return parseInt(bin, 2);
}
function batCalculation(bat1, bat2){
  return (bin2dec(bat1) + bin2dec(bat2) )* 15/ 1000;
}
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
function batteryToPercent(p) {
    if(p > 4.1) {
      p = 100
    } else if(p < 2.5) {
      p = 0
    } else {
      p = p * 100 / 4.1
    }
  return parseFloat(p).toFixed(1)
}
function temperatureToPercent(temp) {
  return parseFloat((temp*15)/100)
}
function addToDeviceList(device, lat, lng, bat, temp, speed){
  Device.find({device: device})
  .then(result => {
    if(result != ""){
      Device.findOneAndUpdate({device: device}, {lat: lat, lng: lng, bat: bat, temp: temp, last_seen: Date.now()})
      .then(result => {
        isInsideGeofence(result.device, result.name ? result.name: result.device ,result.company, result.lat, result.lng);
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
        speed: speed,
        last_seen: Date.now()
      });

      newDevice.save().then(result => {
        isInsideGeofence(result.device, result.name ?  result.name: result.device , result.company, result.lat, result.lng);
      }).catch(err => console.log(err));
    }

  })
  .catch(err =>{console.log(err)});
}
function isInsideGeofence(device, device_name ,company, lat, lng) {
  var textMail = '';

  Company.findById(company).then(companyItem => {
    companyItem.areas.forEach(areas => {
        Area.findOne({name: areas}).then( area => {
          var latLngs = [];

          if(area != null){
            area.points.forEach( point => {
              latLngs.push([point.lat,point.lng]);
            });

            // Returns -1 if coordinates are inside polygon
            const currentState = classifyPoint(latLngs ,[lat, lng]);

           if (currentState == -1){

             // Device is not already inside
             if(!area.devices.includes(device)) {
               console.log(device + ' is INSIDE ' + area.name);
               textMail = device + "[" + device_name + "]" + " is now inside geofence  " + area.name;

               Area.findByIdAndUpdate(area._id, {$push: {devices: device}}).then(r  => console.log('ADDING' + r.devices));
               notifyCompany(company, textMail);

               new History({
                 _id: mongoose.Types.ObjectId(),
                 area: area.name,
                 device: device,
                 action: true,
                 timestamp: Date.now()
               }).save();
             }

             console.log( 'GEOFENCE CHECK - ' + device + ' || ' + area.name + ' = '  + 'INSIDE');
           } else if(currentState == 1){

             // Device was inside
             if(area.devices.includes(device)) {
               console.log(device + ' is OUTSIDE ' + area.name);
               textMail = device + "[" + device_name + "]" + " is now outside geofence  " + area.name;

               Area.findByIdAndUpdate(area._id, {$pull: {devices: device}}).then(r  => console.log('REMOVING' + r.devices));
               notifyCompany(company, textMail);

               new History({
                 _id: mongoose.Types.ObjectId(),
                 area: area.name,
                 device: device,
                 action: false,
                 timestamp: Date.now()
               }).save();
             }

             console.log( 'GEOFENCE CHECK - ' + device + ' || ' + area.name + ' = '  + 'OUTSIDE');
           }
          }
        });
    });
  })
  .catch(err => {console.log(err)});
}
function notifyCompany(company, textMail) {

  User.find({company: company}).then( users => {
    users.forEach( user => {
      var mail = {
        from: "notifications@gloksystems.co.uk",
        to: user.email,
        subject: "GLOK area update",
        text: textMail
      }

      conf.mailTransporter.sendMail(mail, (err, info) => {
        if(err)
          console.log(err)
    });
    })
  })
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
  var startDate = moment(new Date(req.params.date1)).format();
  var endDate   = moment(new Date(req.params.date2)).format();


  Sigfox.find({"device": req.params.device,"time": { '$gte': startDate, '$lte': endDate }}).then(result=> {
    res.send(result);
  });
});

router.post('/', function(req, res, next) {
  var framePattern = /(.{1})(.{31})(.{1})(.{31})(.{8})(.{8})(.{8})(.{4})(.{4})/;
  var binaryFrame = getBinaryFrame(req.body.payload);
  var frame = framePattern.exec(binaryFrame);

  var newEntry = new Sigfox({
    _id: mongoose.Types.ObjectId(),
    device: req.body.device,
    payload: 'deprecated',
    time: Date.now(),
    lat: req.body.lat,
    lng: req.body.lng,
    acqspeed: req.body.acqspeed,
    battery: batCalculation(frame[5], frame[7]),
    voltage: batCalculation(frame[5], frame[7]),
    temp: temperatureToPercent(bin2dec(frame[6])),
    status: frame[8],
    speed: bin2dec(frame[9])* 5 * 1.6
  });

  newEntry
    .save()
    .then(result => {
      res.status(201).json({
          message: req.body.device + ' entry successfully added',
          device_created: result
      });


      var lng = (frame[3] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[4], 2) / Math.pow(10, 6));
      var lat = (frame[1] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[2], 2) / Math.pow(10, 6));

      addToDeviceList(req.body.device, lat, lng,  batteryToPercent(batCalculation(frame[5], frame[7])), temperatureToPercent(req.body.temp), req.body.time, bin2dec(frame[9])* 5 * 1.6);
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
