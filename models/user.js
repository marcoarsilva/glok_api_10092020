var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    isAdmin: mongoose.Schema.Types.Boolean,
    isSuperAdmin: mongoose.Schema.Types.Boolean,
    company: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    username: String,
    password: String,
    notification: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', usersSchema);
