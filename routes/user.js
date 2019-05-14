var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods");
var User = require('../models/user');
var aes256 = require('aes256');
var key = 'm3k3r1@08dummIO!';
var cipher = aes256.createCipher(key);


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

router.post('/', methods.ensureToken , methods.companyExists , function(req, res, next) {
    if(req.payload.user.isSuperAdmin){         
        var user = new User({
            _id: mongoose.Types.ObjectId(),
            isAdmin: (req.body.isAdmin != undefined) ? req.body.isAdmin : false,
            isSuperAdmin: (req.body.isSuperAdmin != undefined) ? req.body.isSuperAdmin : false,
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: cipher.encrypt(req.body.password),
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
                message: 'Couldn\'t create user',
                error: err
            });
        });    
});

router.delete('/:id', methods.ensureToken,function(req, res, next) {
    User
        .findByIdAndRemove(req.params.id)
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Successfully deleted user',
            });
        })
        .catch(err => { 
            console.log(err);
            res.status(500).json({
                message: 'Couldn\'t delete user',
                error: err
            });
        });    
});

module.exports = router;
