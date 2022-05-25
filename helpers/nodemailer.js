/**
 * Helper file for triggering mail
 */
const nodemailer = require('nodemailer');
const path = require('path');
const Logger = require('./logger');
const { Environment } = require('../config/index');

const Transporter = nodemailer.createTransport({
    host: Environment.mailHost,
    auth: {
        user: Environment.mailUsername,
        pass: Environment.mailPassword
    }
});

/**
 * configuration to send an mail
 * 
 * @function SendMail
 * @param {object} mail from, to, subject and body
 * @author Silambuselvam 
 */
const SendMail = async mailOptions => {
  try {
     Logger.log('info', `Accessing Send mail method to trigger an email to ${mailOptions.to}`);
     await Transporter.sendMail(mailOptions);
  } catch (exc) {
      Logger.log('error', `Error in send mail in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
      throw exc;
  }
};

module.exports = {
  SendMail
}