var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Area = require('../models/area');

router.get('/', function(req, res, next) {
    Area
        .find({})
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

router.get('/:id', function(req, res, next) {
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

router.post('/', function(req, res, next) {
    console.log(req);
    var area = new Area({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        points: req.body.points
    });

    area
        .save()
        .then(result => {
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
 
router.put('/:id', function(req, res, next) {
    var newArea = new Area({
        name: req.body.name,
        points: req.body.points
    });


    Area
        .findOneAndUpdate(req.params.id, newArea)
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Successfully updated area',
                area_created: newArea
            });
        })    
});
  
module.exports = router;