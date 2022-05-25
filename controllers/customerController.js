/**
 * Controller file to handle all the customer module business logics
 */
const path = require('path');
const { Logger, Utility } = require('../helpers/index');
const { CustomerModel } = require('../Models/index');

/**
 * Get Active customers
 * 
 * @async
 * @function GetCustomer
 * @returns {Array} - list of active customers
 * @author Silambuselvam
 */
const GetCustomers = async () => {
    try {
      Logger.log('info', 'Accessing GetCustomer controller');
      const query = { deleted: false };
      const result = await CustomerModel.GetCustomers(query);
      return result;  
    } catch (exc) {
      Logger.log('error', `Error in GetCustomer module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
      return exc;  
    }
};

/**
 * Get customers for particular country
 * 
 * @async
 * @function GetCustomersForCountry
 * @param {String} - Country code
 * @returns {Array} - list of customers
 * @author Silambuselvam
 */
const GetCustomersForCountry = async code => {
  try {
    Logger.log('info', 'Accessing GetCustomer for country controller');
    const query = { country: code };
    const result = await CustomerModel.GetCustomers(query);
    return result;  
  } catch (exc) {
    Logger.log('error', `Error in GetCustomerForCountry module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return exc;  
  }
};

/**
 * Get customers based on sms notification
 *
 * @async
 * @function GetCustomersForSMS
 * @returns {Array} - list of customers
 * @author Silambuselvam
 */
const GetCustomersForSMS = async () => {
  try {
    Logger.log('info', 'Accessing GetCustomers for sms controller');
    const query = { notification: 'sms' };
    const result = await CustomerModel.GetCustomers(query);
    return result;  
  } catch (exc) {
    Logger.log('error', `Error in GetCustomersForSMS module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return exc;  
  }
};

/**
 * Get premium customers
 *
 * @async
 * @function GetPremiumCustomers
 * @returns {Array} - list of customers
 * @author Silambuselvam
 */
const GetPremiumCustomers = async () => {
  try {
    Logger.log('info', 'Accessing Get premium Customer controller');
    const query = { premium: true };
    const result = await CustomerModel.GetCustomers(query);
    return result;  
  } catch (exc) {
    Logger.log('error', `Error in GetPremiumCustomers module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return exc;  
  }
};

/**
 * Send notification to the customers
 *
 * @async
 * @function NotifyCustomer
 * @returns {Array} - list of customers
 * @author Silambuselvam
 */
const NotifyCustomer = async ({ id, message }) => {
  try {
    Logger.log('info', 'Accessing notify customers controller');
    const query = { id };
    const [ { notification, mobile, country, email, name }] = await CustomerModel.GetCustomers(query);
    if(notification.length) {
      for(const option of notification) {
        switch(option) {
          case 'sms':
            Utility.SMSNotification({ mobile, country, message });
            break;
          case 'email':
            Utility.EmailNotification({ email, message });
            break;
          case 'call':
            Utility.CallNotification({ mobile, country, message });
            break;
          default:
            return;
        }
      }
    }
    return { success: true, message: `Notification sent to customer ${name}`};
  } catch (exc) {
    Logger.log('error', `Error in Notification module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return exc;
  }
};

/**
 * Add new customer
 *
 * @async
 * @function AddCustomers
 * @param {Object} - customer data
 * @returns {Object} - id as object
 * @author Silambuselvam
 */
const AddCustomers = async opts => {
  try {
    Logger.log('info', 'Accessing add customer controller');
    opts.id = Utility.GenerateUniqueID();
    opts.country = opts.country.toUpperCase();
    const query = { email: opts.email };
    const result = await CustomerModel.GetCustomers(query);
    if(result.length) return { message: 'Customer email id already registered'};
    const { id } = await CustomerModel.AddCustomers(opts);
    return { id };
  } catch (exc) {
    Logger.log('error', `Error in AddCustomers module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return exc;
  }
};

/**
 * Update existing customer
 *
 * @async
 * @function UpdateCustomers
 * @param {Object} - customer data
 * @returns {Object} - id as object
 * @author Silambuselvam
 */
const UpdateCustomers = async opts => {
  try {
    Logger.log('info', 'Accessing Update customer controller');
    const result = await CustomerModel.UpdateCustomers(opts);
    return result;
    if(result) return { message: 'Updated Successfully'};
    else return { message: `Invalid input parameter id: ${opts.id}` };
  } catch (exc) {
    Logger.log('error', `Error in UpdateCustomer module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return exc;
  }
};

/**
 * Delete existing customer
 *
 * @async
 * @function DeleteCustomers
 * @param {Object} - id as object
 * @returns {Object} - deleted count
 * @author Silambuselvam
 */
const DeleteCustomers = async opts => {
  try {
    Logger.log('info', 'Accessing Delete customer controller');
    const result = await CustomerModel.DeleteCustomers(opts);
    if(result) return { id: result.id };
    return result;
  } catch (exc) {
    Logger.log('error', `Error in DeleteCustomer module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return exc;
  }
};


module.exports = {
  GetCustomers,
  GetCustomersForCountry,
  GetCustomersForSMS,
  GetPremiumCustomers,
  NotifyCustomer,
  AddCustomers,
  UpdateCustomers,
  DeleteCustomers
};
