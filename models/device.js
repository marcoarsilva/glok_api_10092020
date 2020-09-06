var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    company: String,
    device: String,
    name: String,
    lat: String,
    lng: String,
    speed: String,
    bat: String,
    temp: String,
    mot: mongoose.Schema.Types.Date,
    notes: String,
    last_seen: mongoose.Schema.Types.Date,
    notifications:{
        tracking: {
            track: mongoose.Schema.Types.Boolean,
            email: String
        },
        deviceDown: mongoose.Schema.Types.Boolean,
        sameLocation1Week: mongoose.Schema.Types.Boolean,
        noSpeed: mongoose.Schema.Types.Boolean,
        isInsideGeofence: mongoose.Schema.Types.Boolean
    }
});

module.exports = mongoose.model('Device', deviceSchema);
