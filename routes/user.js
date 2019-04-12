var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods");

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

router.get('/', methods.ensureToken, function(req, res, next) {
    if(req.payload.user.isAdmin){
        User
        .find({company: req.payload.user.company})
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
    } else if(req.payload.user.isSuperAdmin){
        User
        .find()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
    } else {
        res.status(403).json({
            message: 'You dont have permisson to access this route',
        }); 
    }
  
});

router.post('/', methods.ensureToken , companyExists , function(req, res, next) {
    if(req.payload.user.isSuperAdmin){         
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
    } else if(req.payload.user.isAdmin){    
        var user = new User({
            _id: mongoose.Types.ObjectId(),
            isAdmin: false,
            isSuperAdmin: false,
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            company: req.payload.user.company
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
    }
});

router.put('/:id', methods.ensureToken,function(req, res, next) {
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
