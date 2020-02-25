var mongoose = require('mongoose');

var deviceRecord = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: String,
    device: String,
    modifier:String,
    timestamp: mongoose.Schema.Types.Date
});

module.exports = mongoose.model('deviceRecord', deviceRecord);
