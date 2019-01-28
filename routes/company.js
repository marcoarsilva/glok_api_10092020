var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Company = require('../models/company');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    var company = new Company({
        _id: mongoose.Types.ObjectId(),
        company_name: req.body.company_name,
        company_email: req.body.company_email,
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

router.get('/:id', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

router.put('/:id', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  
module.exports = router;