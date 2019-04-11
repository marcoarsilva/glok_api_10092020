var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user');
var Company = require('../models/company');


function companyExists(req, res, next) {
    Company
    .findById(req.body.company_id)
    .then( result => {
        next();
    })
    .catch(err => { 
        res.status(404).json({
            message: 'Cannot add user no company with id: ' + req.body.company_id,
            error: err
        });
       
    });
}

router.get('/', function(req, res, next) {
    User
    .find({})
    .then(users => {
        res.send(users);
    })
    .catch(err => {
        res.status(500).json({
            message: 'Server error',
            error: err
        });
    })
});

router.post('/', companyExists , function(req, res, next) {
  var user = new User({
    _id: mongoose.Types.ObjectId(),
    isAdmin: (req.body.isAdmin != undefined) ? req.body.isAdmin : false,
    isSuperAdmin: (req.body.isSuperAdmin != undefined) ? req.body.isSuperAdmin : false,
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    company: req.body.company
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

router.put('/:id', function(req, res, next) {
    var newUser = new User({
        isAdmin: (req.body.isAdmin != undefined) ? req.body.isAdmin : false,
        isSuperAdmin: (req.body.isSuperAdmin != undefined) ? req.body.isSuperAdmin : false,
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        company: req.body.company
    });


    User
        .findOneAndUpdate({_id: req.params.id}, newUser)
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Successfully updated user',
                area_created: newUser
            });
        })
        .catch(err => { 
            console.log(err);
            res.status(500).json({
                message: 'Couldn\'t create company',
                error: err
            });
        });    
});
module.exports = router;
