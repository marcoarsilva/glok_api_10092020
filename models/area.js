var mongoose = require('mongoose');

var areaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    points: [{lat:String, lng:String}]
});

module.exports = mongoose.model('Area', areaSchema); 