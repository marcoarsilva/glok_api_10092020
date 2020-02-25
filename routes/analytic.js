var express = require('express');
var router = express.Router();
var methods = require("../methods");
var loginRecord = require('../models/loginRecord');
var deviceRecord = require('../models/deviceRecord');
var mongoose = require('mongoose');


router.get('/login', methods.ensureToken,function(req, res, next) {
    if(req.payload.user.isSuperAdmin) {
        loginRecord.find({})
            .then( records => {
                res.send(records)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Server error',
                    error: err
                });
            });
    } else {
        res.sendStatus(403);
    }
});

router.get('/device', methods.ensureToken,function(req, res, next) {
    if(req.payload.user.isSuperAdmin) {
        deviceRecord.find({})
            .then( records => {
                res.send(records)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Server error',
                    error: err
                });
            });
    } else {
        res.sendStatus(403);
    }
});




module.exports = router;
