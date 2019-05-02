var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods");
var jwt = require("jsonwebtoken");
var mongoose = require('mongoose');

var History = require('../models/history');


module.exports = router;

router.get('/:device' , function(req, res, next) {
    console.log(req.params.device);
    History
        .findOne({device: req.params.device})
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

router.delete('/:id' , function(req, res, next) {
    console.log(req.params.device);
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

router.post('/' , function(req, res, next) {
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