var mongoose = require('mongoose');

var historySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    area: String,
    device: String,
    action: String,
    timestamp: mongoose.Schema.Types.Date
});

module.exports = mongoose.model('History', historySchema);