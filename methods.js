let jwt = require('jsonwebtoken')
var Company = require('./models/company');

module.exports.ensureToken = function(req, res, next) {
    var bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
  
        jwt.verify(bearerToken, '08dummIO@', (err, result) => {
            if(err) { res.sendStatus(403) }
            else{ 
                req.payload = result;
                next(); 
            }
        })
    } else {
     res.sendStatus(403)
    }
}

module.exports.companyExists = function(req, res, next) {
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

// TODO
module.exports.usernameExists = function(req, res, next) {
    next();
}

//TODO
module.exports.emailExists = function(req, res, next) {
    next();
}

// TODO
module.exports.encryptPassword = function() {

}

// TODO
module.exports.decryptPassword = function() {

}