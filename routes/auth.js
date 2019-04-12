var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods")
var jwt = require("jsonwebtoken")
var mongoose = require('mongoose');

var User = require('../models/user');

router.get('/' ,function(req, res, next) {
  let p_username = req.body.username;
  let p_password = req.body.password;

  User
      .findOne({username: req.body.username})
      .then(result => {
          if(p_username === result.username && p_password === result.password){
            jwt.sign({user: result}, 'secretkey',(err, token) => {
                res.send({
                  ok: true,
                  message: "Login successful",
                  token: token
                })
              })
           }else {
            res.send({
              ok: false,
              message: "Username or password incorrect"
             })
           }
      })
      .catch(err => { 
          console.log(err);
      });
});

module.exports = router;