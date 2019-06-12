
var conf = require('./configs.js');
var mongoose = require('mongoose');
var User = require('./models/user')
var Device = require('./models/device')


//connect to database
mongoose.connect(conf.mongodb, {useNewUrlParser: true});
var job = new CronJob('00 00 12 * * 0-6', function() {
  /*
   * Runs every day
   * at 12:00:00 AM.
   */

  Device.find({}).then( devices => {
    devices.forEach(device => {
     var now = Date.now();
     var devLastSeen = new Date(device.last_seen);

     var timeDiff = Math.abs(devLastSeen.getTime() - now);
     var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

     console.log( device.device +  ">" + diffDays);

     if(diffDays > 1){
         notifyCompany(device.company, "Device " + device.name + "is down for more than  1 day");
         Device.findByIdAndUpdate(device.id, {notifications:{deviceDown: true}});
     }
    })
})


  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  timeZone /* Time zone of this job. */
);


 

   function notifyCompany(company, textMail) {
  
    User.find({company: company}).then( users => {
      users.forEach( user => {
        var mail = {
          from: "notifications@gloksystems.co.uk",
          to: user.email,
          subject: "GLOK area update",
          text: textMail
        }
  
        conf.mailTransporter.sendMail(mail, (err, info) => {
          if(err)
            console.log(err)
          else
            console.log(info);
      });
      })
    })
}