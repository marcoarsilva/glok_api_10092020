const nodemailer = require("nodemailer");
const mongoCon = 'mongodb://glokdb:IBX74bRtS79gAYIzHvmU3mMqtlBzZmiTTsHs9IheeP9Ujs2axcNIy1WrkO0dKSDAy1r9t4CAD9GCI8EaPAfaXA%3D%3D@glokdb.documents.azure.com:10255/mean?authSource=admin&replicaSet=globaldb&ssl=true';
//const mongoCon = 'mongodb://localhost/glok';

const transporter = nodemailer.createTransport({
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


