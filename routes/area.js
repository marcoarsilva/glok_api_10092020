var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var methods = require("../methods")
var Area = require('../models/area');
var Company = require('../models/company');


router.get('/', methods.ensureToken,function(req, res, next) {
        Area
            .find({company: req.payload.user.company})
            .then(areas => {
                res.send(areas);
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Server error',
                    error: err
                });
            })
});

router.get('/:id', methods.ensureToken,function(req, res, next) {
    Area
        .findById(req.params.id)
        .then(area => {
            res.send(area);
        })
        .catch(err => {
            res.status(404).json({
                message: 'Couldn\'t found area with id: ' + req.params.id,
                error: err
            });
        })
});

router.delete('/:id', methods.ensureToken,function(req, res, next) {
    Area
        .findByIdAndRemove(req.params.id)
        .then(area => {
            res.status(200).json({
                message: 'Successfully deleted area',
                area_deleted: area
            });


            Company.findOneAndUpdate({_id: req.payload.user.company}, 
                {$pull: {areas: area.name}})
            .then(company => {
                console.log(company);
            }).catch(err => {
                console.log(err)
            })
    
        })
        .catch(err => {
            res.status(404).json({
                message: 'Couldn\'t delete area with id: ' + req.params.id,
                error: err
            });
        })
});

router.post('/', methods.ensureToken, methods.areaExists , function(req, res, next) {
    var area = new Area({
        _id: mongoose.Types.ObjectId(),
        company: req.payload.user.company,
        name: req.body.name,
        points: req.body.points,
        devices: (req.body.areas != undefined) ? req.body.devices : []

    });
 

    area
        .save()
        .then(result => {

            Company.findOneAndUpdate({_id: req.payload.user.company}, {$push: {areas: req.body.name}})
                .then(company => {
                    console.log(company);
                });


            console.log(result);
            console.log(req.body);
            res.status(201).json({
                message: 'Successfully created area',
                area_created: area
            });
        })
        .catch(err => { 
            console.log(err);
            res.status(500).json({
                message: 'Couldn\'t create area',
                error: err
            });
        });
});
 
router.put('/:id', methods.ensureToken, function(req, res, next) {
    var newArea = new Area({
        name: req.body.name,
        points: req.body.points
    });


    Area
        .findOneAndUpdate({_id:req.params.id}, newArea)
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Successfully updated area',
                area_created: newArea
            });
        })    
});
  
module.exports = router;