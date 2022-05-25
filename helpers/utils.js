/**
 * Utility files
 */
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { Environment } = require('../config/index');
const Logger = require('./logger');
const Mailer = require('./nodemailer');
const { Constants: { EmailSubject } } = require('../constants/index');

/**
* returns unique id using uuid/v4
*
* @function GenerateUniqueId
* @returns {String} - uniuqe id
* @author Silambuselvam
*/
const GenerateUniqueID = () => {
    return uuid.v4();
};

/**
 * returns status code with success response
 *
 * @function SuccessResponse
 * @param {object} data
 * @returns {object} - object for success response
 * @author Silambuselvam
 */
const SuccessResponse = async data => {
    const success = Object.assign({
        status: 'success',
        statusCode: '200',
        data
    });
    return success;
};

/**
* returns status code with error response
*
* @function ErrorResponse
* @param {object} data
* @returns {object} - object for error response
* @author Silambuselvam
*/
const ErrorResponse = async data => {
    const error = Object.assign({
        status: 'error',
        statusCode: data && data.statusCode ? data.statusCode : 403,
        data: data && data.message ? data.message : 'No Data'
    });
    return error;
};

/**
* returns decoded token
*
* @function DecryptToken
* @param {string} token
* @returns {object} - decoded object
* @author Silambuselvan
*/
const DecryptToken = async token => {
    const decoded = jwt.verify(token, Environment.secretKey);
    return decoded;
};

/**
* returns encoded token
*
* @function EncryptToken
* @param {object} user object
* @returns {string} - encoded token
* @author Silambuselvan
*/
const EncryptToken = async user => {
    const token = jwt.sign(user, Environment.secretKey);
    return token;
};

/**
* returns invalid token message
*
* @function InvalidToken
* @returns {object} - invalid response
* @author Silambuselvam
*/
const InvalidToken = () => {
    const invalid = { status: 'invalid', statusCode: '401', message: 'Invalid token' };
    return invalid;
};

/**
* Send email notification to the regeistered email
*
* @function EmailNotification
* @param {object} email id with message
* @returns {boolean} - true or false
* @author Silambuselvam
*/
const EmailNotification = async ({ email, message }) => {
    const mailOptions = {
        from: Environment.mailFrom,
        to: email,
        subject: EmailSubject,
        text: message
    };
    await Mailer.SendMail(mailOptions);
};


module.exports = {
    GenerateUniqueID,
    SuccessResponse,
    ErrorResponse,
    EmailNotification,
    EncryptToken,
    DecryptToken,
    InvalidToken
};
