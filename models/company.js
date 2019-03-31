var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    address: String,
    phone: String,
    vat: String,
    areas: [String],
    creation_date: mongoose.Schema.Types.Date
});

module.exports = mongoose.model('Company', companySchema);