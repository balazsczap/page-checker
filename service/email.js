const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const { promisify } = require('util');
const { source } = require('../config');

if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1',
  });
}

const SES = new AWS.SES();

const transporter = nodemailer.createTransport({ SES });
transporter.sendMail = promisify(transporter.sendMail);

async function notifyChange(diff, email) {
  await transporter.sendMail({
    from: source,
    to: email,
    subject: 'Page changed!',
    html: `<html><body>${JSON.stringify(diff)}</body></html>`,
  });
}

module.exports = { notifyChange };
