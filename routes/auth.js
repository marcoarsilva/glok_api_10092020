var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken")
var User = require('../models/user');
var aes256 = require('aes256');
var key = 'm3k3r1@08dummIO!';
var cipher = aes256.createCipher(key);


router.post('/' ,function(req, res, next) {
  let p_username = req.body.username;
  let p_password = req.body.password;

  User
      .findOne({username: req.body.username})
      .then(result => {
        if(result.isSuperAdmin)
          permisson = "Root"
        else if(result.isAdmin)
         permisson = "Admin"
        else 
          permisson = "User"

        if(p_username === result.username && p_password === cipher.decrypt(result.password)){
            jwt.sign({user: result}, '08dummIO@',(err, token) => {
                res.send({
                  ok: true,
                  message: "Login successful",
                  token: token,
                  permisson: permisson
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