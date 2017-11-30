require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// console.log(process.env);

const sendAlert = (txt = '') => {
  sgMail.setApiKey(process.env.SENDGRID_KEY);
  const msg = {
    to: process.env.EMAIL,
    from: 'noreply@localhost',
    subject: 'Mongodb is down',
    text: 'mongodb is down restarted the process\n' + txt
  };
  sgMail.send(msg);
};

const { spawnSync } = require('child_process');
const mongod = spawnSync('ps', ['A']);

if (mongod.stdout.toString().indexOf('mongod') === -1) {
  const mongodRestart = spawnSync('service', ['mongod', 'start']);
  sendAlert(mongodRestart.stdout.toString());
  console.log('mongodb is down restarted the process');
} else {
  console.log('all good, mongo is running');
}
