var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods");
var Company = require('../models/company');

router.get('/', methods.ensureToken ,function(req, res, next) {
    if(req.payload.user){
        Company
        .find({})
        .then(companies => {
            res.send(companies);
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
router.get('/areas', methods.ensureToken ,function(req, res, next) {
    if(req.payload.user){
        Company
        .findById(req.payload.user.company)
        .then(company => {
            res.send(company.areas);
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

router.get('/:id', methods.ensureToken ,function(req, res, next) {
    if(req.payload.user.isSuperAdmin){
        Company
        .findById(req.params.id)
        .then(company => {
            res.send(company);
        })
        .catch(err => {
            res.status(404).json({
                message: 'Couldn\'t found company with id: ' + req.params.id,
                error: err
            });
        })
    }

});

router.delete('/:id', methods.ensureToken ,function(req, res, next) {
    if(req.payload.user.isSuperAdmin){
        Company
        .findByIdAndRemove(req.params.id)
        .then(company => {
            if(!company){
                res.status(404).json({
                    message: 'No device with id ' + req.params.id,
                });
               } else {
                res.status(202).json({
                    message: 'Successfuly deleted company',
                    company_deleted: company
                });
               }
        })
        .catch(err => {
            res.status(404).json({
                message: 'Couldn\'t delete company with id: ' + req.params.id,
                error: err
            });
        })
    } else {
        res.status(403).json({
            message: 'You dont have enough permissons',
        });
    }

});

router.post('/', methods.ensureToken, methods.companyAlreadyExists ,function(req, res, next) {
    if(req.payload.user.isSuperAdmin){
        var company = new Company({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            vat: req.body.vat,
            areas: (req.body.areas != undefined) ? req.body.areas : [],
            creation_date: Date.now()
        });
    
        company
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Successfully created company',
                    company_created: company
                });
            })
            .catch(err => { 
                console.log(err);
                res.status(500).json({
                    message: 'Couldn\'t create company',
                    error: err
                });
        });
    }
});

router.put('/:id', methods.ensureToken, function(req, res, next) {
    if(req.payload.user.isSuperAdmin){
        var newCompany = new Company({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            vat: req.body.vat,
            areas: req.body.areas,
        });
    
    
        Company
            .findOneAndUpdate({_id: req.params.id}, newCompany)
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Successfully updated company',
                    company_created: newCompany
                });
        }) 
    }   
});
  
module.exports = router;