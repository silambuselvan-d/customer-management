/**
 * Controller file to handle all the user module business logics
 */
const path = require('path');
const { Logger, Utility: { EncryptToken } } = require('../helpers/index');
const { UserModel } = require('../Models/index');


/**
 * Authorize user
 *
 * @async
 * @function LoginUser
 * @returns {Array} - list of active customers
 * @author Silambuselvam
 */
const LoginUser = async opts => {
  try {
    Logger.log('info', 'Accessing user controller to login user');
    const result = await UserModel.GetUser(opts);
    if(result && !result.loginId) return { statusCode: 404, message: result.message };
    const token = EncryptToken(result);
    return token
  } catch (exc) {
    Logger.log('error', `Error in LoginUser module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return exc;
  }
};


module.exports = {
  LoginUser
}

