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

module.exports.companyAlreadyExists = function(req, res, next) {
    Company
    .find({name: req.body.name})
    .then( result => {
        if(result.length){
            res.status(409).json({
                message: 'Company already exists: ' + req.body.name,
            });
        } else {
            next();
        }
    })
    .catch(err => { 
        res.status(500).json({
            message: 'Server error',
            error: err
        });
    
    });
}


module.exports.usernameExists = function(req, res, next) {
    User
        .find({name: req.body.name})
        .then( result => {
            if(result.length){
                res.status(409).json({
                    message: 'Username already exists: ' + req.body.name,
                });
            } else {
                next();
            }
        })
        .catch(err => { 
            res.status(500).json({
                message: 'Server error',
                error: err
            });
        
        });

}
