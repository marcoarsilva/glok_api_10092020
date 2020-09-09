const nodemailer = require("nodemailer");
const mongoCon = 'mongodb://glokdb:IBX74bRtS79gAYIzHvmU3mMqtlBzZmiTTsHs9IheeP9Ujs2axcNIy1WrkO0dKSDAy1r9t4CAD9GCI8EaPAfaXA%3D%3D@glokdb.documents.azure.com:10255/mean?authSource=admin&replicaSet=globaldb&ssl=true';
//const mongoCon = 'mongodb://localhost/glok';

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: 'nofitications@gloksystems.co.uk',
        pass: 'haWfur-kombe9-qeqfoz'
    },
    secure: false,
    requireTLS: true,
    tls: {
        ciphers: 'SSLv3'
        // rejectUnauthorized: false
    }
});


module.exports = {
    mongodb: mongoCon,
    mailTransporter: transporter
};


