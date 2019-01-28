var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  var user = new User({
    _id: mongoose.Types.ObjectId(),
    isAdmin: (req.body.isAdmin != undefined) ? req.body.isAdmin : false,
    isSuperAdmin: (req.body.isSuperAdmin != undefined) ? req.body.isSuperAdmin : false,
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
});

user
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Successfully created user',
            company_created: user
        });
    })
    .catch(err => { 
        console.log(err);
        res.status(500).json({
            message: 'Couldn\'t create user',
            error: err
        });
    });
});


module.exports = router;
