/**
 * Environment variables
 */

const dotenv = require('dotenv');

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 9090;
const hostname = process.env.HOST || 'http://localhost';
const mongoURI = process.env.MONGODB || 'mongodb://localhost:27017/customer-management';
const secretKey = process.env.SECRET_KEY || 'newSecretK3y';
const mailHost = process.env.MAIL_HOST || '';
const mailFrom = process.env.MAIL_FROM || '';
const mailUsername = process.env.MAIL_USERNAME || '';
const mailPassword = process.env.MAIL_PASSWORD || '';

module.exports = {
    port,
    hostname,
    mongoURI,
    secretKey,
    mailHost,
    mailFrom,
    mailUsername,
    mailPassword,
    nodeEnv
};