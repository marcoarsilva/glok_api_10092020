const nodemailer = require("nodemailer");
var mongoCon = 'mongodb://glokdb:IBX74bRtS79gAYIzHvmU3mMqtlBzZmiTTsHs9IheeP9Ujs2axcNIy1WrkO0dKSDAy1r9t4CAD9GCI8EaPAfaXA==@glokdb-uksouth.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false';

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
