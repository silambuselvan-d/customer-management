/**
 * model file to handle all the database connection logics
 */
const path = require('path');
const { CustomerSchema } = require('../schema/index');
const { Logger } = require('../helpers/index');


/**
 * Get customer
 *
 * @function GetCustomers
 * @param {object} - query to filter the data
 * @returns {object} - returns customer data
 * @author Silambuselvam
 */
const GetCustomers = async query => {
    try {
      Logger.log('info', `Accessing customer module in ${path.basename(__filename)}`);
      const project = { deleted: 0, _id:0 };
      const data = await CustomerSchema.find(query, project);
      return data;  
    } catch (exc) {
      Logger.log('error', `Error in GetCustomers module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
      throw exc;  
    }
};


/**
 * Add customer
 *
 * @function AddCustomers
 * @param {object} opts
 * @returns {object} - returns customer data
 * @author Silambuselvam
 */
const AddCustomers = async opts => {
  try {
    Logger.log('info', `Accessing Addcustomer module in ${path.basename(__filename)}`);
    const NewCustomer = new CustomerSchema(opts);
    const data = await NewCustomer.save();
    return data;  
  } catch (exc) {
    Logger.log('error', `Error in AddCustomers module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;  
  }
};


/**
 * Update customer
 *
 * @function UpdateCustomers
 * @param {object} opts
 * @returns {object} - returns modified count
 * @author Silambuselvam
 */
const UpdateCustomers = async opts => {
  try {
    Logger.log('info', `Accessing UpdateCustomer module in ${path.basename(__filename)}`);
    const data = await CustomerSchema.findOneAndUpdate({ id: opts.id }, { $set: opts });
    return data;  
  } catch (exc) {
    Logger.log('error', `Error in UpdateCustomers module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;  
  }
};


/**
 * Delete customer
 *
 * @function DeleteCustomers
 * @param {object} {id: ''} or list of {id: []}
 * @returns {object} - returns modified count / modified id
 * @author Silambuselvam
 */
const DeleteCustomers = async opts => {
  try {
    Logger.log('info', `Accessing DeleteCustomrs module in ${path.basename(__filename)}`);
    let data;
    if(typeof opts.id === 'string') {
      data = await CustomerSchema.findOneAndUpdate({ id: opts.id }, { $set: { deleted: true }}); 
    } else {
      const bulkWriteQueries = opts.id.reduce((acc, val) => {
        return [
          ...acc,
          {
            updateOne: {
              filter: { id: val },
              update: { $set: { delete: true }},
              upsert: true
            }
          }
        ];
      }, []);
      data = await CustomerSchema.bulkWrite(bulkWriteQueries, {});
    }
    return data;
  } catch (exc) {
    Logger.log('error', `Error in DeleteCustomers module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

module.exports = {
  GetCustomers,
  AddCustomers,
  UpdateCustomers,
  DeleteCustomers
};