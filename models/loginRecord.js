var mongoose = require('mongoose');

var loginRecord = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: String,
    action:String,
    ip: String,
    browser: String,
    timestamp: mongoose.Schema.Types.Date
});

module.exports = mongoose.model('loginRecord', loginRecord);
