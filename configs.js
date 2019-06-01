const nodemailer = require("nodemailer");
var mongoCon = 'mongodb://77.68.86.48:47017/glok?authSource=admin';

var transporter = nodemailer.createTransport({
    pool: true,
    host: 'gloksystems.co.uk',
    port: 465,
    secure: true,
    auth: {
        user: 'notifications@gloksystems.co.uk',
        pass: 'YUW1sQjUTo*d'
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
});

 
module.exports = {
    mongodb: mongoCon,
    mailTransporter: transporter
};
  