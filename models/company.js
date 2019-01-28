var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    company_name: String,
    company_email: String,
});

module.exports = mongoose.model('Company', companySchema);