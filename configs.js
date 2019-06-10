const nodemailer = require("nodemailer");
 var mongoCon = 'mongodb://77.68.86.48:47017/glok?authSource=admin'; 
// var mongoCon = 'mongodb://glokv2db:mpGahCBOeRfZDWHp731L63Vx36hoIoahLWawhQy9sJ7rohKqALPsH1BIsi1Coyhvm1ODxzRtZUtfcl1BYFQG0A==@glokv2db.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false';

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
  