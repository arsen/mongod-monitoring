require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// console.log(process.env);

const sendAlert = (txt = '') => {
  sgMail.setApiKey(process.env.SENDGRID_KEY);
  const msg = {
    to: process.env.EMAIL,
    from: 'noreply@localhost',
    subject: 'Mongodb is down',
    text: new Date().toString() + ' : mongodb is down restarted the process\n-----------------\n' + txt
  };
  sgMail.send(msg);
};

const { spawnSync } = require('child_process');

setInterval(() => {
  const mongod = spawnSync('ps', ['-A']);
  let time = new Date();
  if (mongod.stdout.toString().indexOf('mongod') === -1) {
    const mongodRestart = spawnSync('service', ['mongod', 'start']);
    sendAlert(mongodRestart.stdout.toString());
    console.log(time.toString() + ' : mongodb is down restarted the process');
  } else {
    console.log(time.toString() + ' : all good, mongo is running');
  }
}, 15000);

