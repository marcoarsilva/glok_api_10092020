var mongoose = require('mongoose');

var logSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lat: String,
    lng: String,
    bat: String,
    temp: String,
    status: String,
    speed: String,
    timestamp: mongoose.Schema.Types.Date
});

module.exports = mongoose.model('Log', logSchema);