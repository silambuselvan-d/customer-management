/**
 * Validator methods to handle customer inputs
 */
const path = require('path');
const { Utility: { ErrorResponse, InvalidToken, DecryptToken }, Logger } = require('../helpers/index');
const { Constants: { CustomerInputParams, CountryList, NotficationOptions, CustomerAllParams } } = require('../constants/index');
const { UserModel } = require('../Models/index');


/**
 * customer input validation for add/update method
 *
 * @async
 * @function CustomerInputValidation
 * @param {object} - input object and add/update flag
 * @returns {object} - return error response for failed cases
 * @author Silambuselvam
 */
const CustomerInputValidation = async (opts, flag) => {
    const customerData = Object.keys(opts);
    // Validate mandatory parameters based on flag (add: true)
    if (flag) {
      for (const customer of CustomerInputParams) {
        if (!customerData.includes(customer)) return await ErrorResponse({ message: `${customer} is missing parameter` });
      }
    }
  
    // validation for wrong input parameters
    for (const customer of customerData) {
      if (!CustomerAllParams.includes(customer)) return await ErrorResponse({ message: `Invalid input parameter ${customer}` });
    }
  
    // validation for premium type
    if (opts.premium && typeof opts.premium !== 'boolean') return await ErrorResponse({ message: `Premium input field support either true or false value` });
  
    // validation for ISO country codes
    if (opts.country && !CountryList.includes(opts.country.toUpperCase())) return await ErrorResponse({ message: `Country code ${opts.country} should match with ISO code` });
  
    // validation for notification options
    if (opts.notification && opts.notification.length) {
      for (const option of opts.notification) {
        if (!NotficationOptions.includes(option)) return await ErrorResponse({ message: `Invalid notification option ${option}` });
      }
    } else {
      if (flag) return await ErrorResponse({ message: `Notification list should not be empty` });
    }
  
    // validation for email address
    if (opts.email) {
      const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      const status = emailRegex.test(opts.email);
      if (!status) return await ErrorResponse({ message: `Invalid email id ${opts.email}` });
    } else {
      if (flag) return await ErrorResponse({ message: `Please enter email id` });
    }
  
    // validation for mobile number
    if (opts.mobile) {
      const mobileRegex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
      const status = mobileRegex.test(opts.mobile);
      if (!status) return await ErrorResponse({ message: `Invalid mobile number ${opts.mobile}` });
    } else {
      if (flag) return await ErrorResponse({ message: `Please enter mobile number` });
    }
  
    return true;
  };

/**
 * User validations
 *
 * @async
 * @function AuthValidation
 * @param {object} - req object
 * @returns {object} - return error response for failed cases
 * @author Silambuselvam
 */
  const AuthValidation = async (req, res, next) => {
    try {
      const token = req.headers.token;
      // Get invalid token response
      const invalidRes = await InvalidToken();
      // validation for token exist in header
      if (!token) return res.status(invalidRes.statusCode).send(invalidRes);
  
      // decode token to get the user object
      const decodedToken = await DecryptToken(token);
      if (!decodedToken) return res.status(invalidRes.statusCode).send(invalidRes);
  
      // Validate the token information with database
      const user = await UserModel.GetUser({ loginId: decodedToken.loginId });
  
      // return error res if the user is not exist in the database
      if (!user.loginId) return res.status(invalidRes.statusCode).send(invalidRes);
  
      // validation for super user access
      if (!user.superUser && AuthMethods.includes(req.method)) {
        return res.status(403).json(await ErrorResponse({ message: 'Insert, update and delete operations should be performed only by super users.' }));
      }
      next();
    } catch (exc) {
      Logger.log('error', `Error in AuthValidation in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
      return res.send(exc);
    }
  };

  module.exports = {
    CustomerInputValidation,
    AuthValidation
  };
  