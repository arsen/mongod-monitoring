require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// console.log(process.env);

const sendAlert = (subject, txt) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY);
  const msg = {
    to: process.env.EMAIL,
    from: 'noreply@localhost',
    subject: subject,
    text: txt
  };
  sgMail.send(msg);
};

const { spawnSync } = require('child_process');

let counter = 0;

setInterval(() => {
  const mongod = spawnSync('ps', ['-A']);
  let time = new Date();
  if (mongod.stdout.toString().indexOf('mongod') === -1) {
    if (counter <= 5) {
      counter++;
      const mongodRestart = spawnSync('service', ['mongod', 'start']);
      let emailTxt = 
      `${time.toString()} : mongodb was down restarted the process #${counter} time
      -----------------
      ${mongodRestart.stdout.toString()}`;

      sendAlert('Mongodb restarted!', emailTxt);
      console.log(time.toString() + ' : mongodb was down restarted the process');
    }
    else {
      sendAlert('MONGO DOWN: CAN NOT RESTART!!!', 'MONGO IS DOWN, CAN NOT RESTART');
    }
  } else {
    counter = 0;
    console.log(time.toString() + ' : all good, mongodb is running :)');
  }
}, 15000);

