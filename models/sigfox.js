var mongoose = require('mongoose');

var sigfox = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    device: String,
    payload: String,
    time: mongoose.Schema.Types.Date,
    station: String,
    lat: String,
    lng: String,
});

module.exports = mongoose.model('Sigfox', sigfox);