var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods");
var User = require('../models/user');
var aes256 = require('aes256');
var key = 'm3k3r1@08dummIO!';
var cipher = aes256.createCipher(key);
var conf = require('./../configs');


router.post('/changePassword', methods.ensureToken, (req, res, next) => {
    if(req.body.oldPassword == cipher.decrypt(req.payload.user.password)){
        User.findByIdAndUpdate(req.payload.user._id, {password: cipher.encrypt(req.body.newPassword)})
            .then(
                res.status(200).json({
                    message: 'Password updated',
                })
            )
            .catch(err => {
                    res.status(200).json({
                        message: 'Server error',
                        error: err
                    });
            })
    } else {
        res.status(200).json({
            message: 'Wrong password',
        });
    }
});



router.post('/resetPassword', (req, res, next) => {
    // TODO randomize
    var resetPsw = 'welcome1234';

    console.log(req.body.email)
    User.findOneAndUpdate({email: req.body.email}, {password: cipher.encrypt(resetPsw)})
        .then( user => {
                sendMail(user, 'Your password was reset to :'+ resetPsw +'. If you didn’t create this request contact the administrator.')
                res.status(200).json({
                    message: 'Password updated',
                })
            }
        )
        .catch(err => {
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        })
});

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

router.post('/', methods.ensureToken , methods.usernameExists , methods.companyExists , function(req, res, next) {
    if(req.payload.user.isSuperAdmin){
        var user = new User({
            _id: mongoose.Types.ObjectId(),
            isAdmin: (req.body.isAdmin != undefined) ? req.body.isAdmin : false,
            isSuperAdmin: (req.body.isSuperAdmin != undefined) ? req.body.isSuperAdmin : false,
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: cipher.encrypt(req.body.password),
            company: req.body.company,
            notification: false
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
            company: req.payload.user.company,
            notification: false
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
        isAdmin: (req.body.isAdmin !== undefined) ? req.body.isAdmin : false,
        isSuperAdmin: (req.body.isSuperAdmin !== undefined) ? req.body.isSuperAdmin : false,
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        company: req.body.company,
        notification: (req.body.notification !== undefined) ? req.body.notification : false,
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

router.get('/:id', methods.ensureToken,function(req, res, next) {
    User
        .findOne({_id: req.params.id})
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Successfully found user',
                user: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Couldn\'t found user',
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
                user_deleted: result
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

function sendMail(user, textMail) {
    var mail = {
        from: "notifications@gloksystems.co.uk",
        to: user.email,
        subject: "GLOK update",
        text: textMail
    };

    conf.mailTransporter.sendMail(mail, (err, info) => {
        if(err)
            console.log(err);
        else
            console.log(info);
    });
}

module.exports = router;
