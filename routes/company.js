var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Company = require('../models/company');

router.get('/', function(req, res, next) {
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
});

router.get('/:id', function(req, res, next) {
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
});

router.post('/', function(req, res, next) {
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
});

router.put('/:id', function(req, res, next) {
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
});
  
module.exports = router;