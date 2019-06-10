var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var methods = require("../methods");
var jwt = require("jsonwebtoken");
var mongoose = require('mongoose');
var methods = require("../methods");
var History = require('../models/history');


module.exports = router;

router.get('/:area' , methods.ensureToken ,function(req, res, next) {
    History
        .find({area: req.params.area})
        .sort({_id:-1})  
        .then(result => {
            res.send(result);
        })
        .catch( err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
});

router.get('/byDevice/:device' , methods.ensureToken ,function(req, res, next) {
    History
        .find({device: req.params.device})
        .sort({_id:-1})  
        .then(result => {
            res.send(result);
        })
        .catch( err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
});

router.get('/byDevice/:device/:date1/:date2' , methods.ensureToken ,function(req, res, next) {
    var startDate = moment(new Date(req.params.date1)) 
    var endDate   = moment(new Date(req.params.date2))


    History
    .find({device: req.params.device, timestamp: { '$gte': startDate, '$lte': endDate }})
    .then(result => {
        res.send(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            message: 'Server error',
            error: err
        });
    })
});

router.get('/:area/:date1/:date2' , methods.ensureToken ,function(req, res, next) {
    var startDate = moment(new Date(req.params.date1)) 
    var endDate   = moment(new Date(req.params.date2))
    
    History
        .find({area: req.params.area, timestamp: { '$gte': startDate, '$lte': endDate }})
        .then(result => {
            res.send(result);
        })
        .catch( err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
});
router.get('/:area/:device' , methods.ensureToken ,function(req, res, next) { 
    History
        .find({area: req.params.area, device: req.params.device})
        .then(result => {
            res.send(result);
        })
        .catch( err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
});
router.get('/:area/:date1/:date2/:device' , methods.ensureToken ,function(req, res, next) {
    var startDate = moment(new Date(req.params.date1)) 
    var endDate   = moment(new Date(req.params.date2))
    
    History
        .find({area: req.params.area, timestamp: { '$gte': startDate, '$lte': endDate }, device: req.params.device})
        .then(result => {
            res.send(result);
        })
        .catch( err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
});
router.delete('/:id' , methods.ensureToken ,function(req, res, next) {
    History
        .findByIdAndRemove(req.params._id)
        .sort({_id:-1})  
        .then(result => {
            res.send(result);
        })
        .catch( err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
});
router.post('/' , methods.ensureToken ,function(req, res, next) {
    console.log(req.params.device);

    var newLog = new History({
        _id: mongoose.Types.ObjectId(),
        device: req.body.device,
        area: req.body.area,
        action: req.body.action,
        timestamp: Date.now()
    });

    newLog
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: req.body.device + ' ' + req.body.action + ' area ' + req.body.area,
                history_logged: newLog
            });
        })
});