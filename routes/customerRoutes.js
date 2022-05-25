/**
 * Routes file to handle all the incoming requests
 */
const express = require('express');
const { CustomerController } = require('../controllers/index');
const { Logger, Utility } = require('../helpers/index');
const { CustomerValidator: { CustomerInputValidation, AuthValidation } } = require('../validators/index');

const router = express.Router();
router.use(AuthValidation);

/**
 * Get all active customers
 */
router.get('/getCustomers', async (req, res) => {
  Logger.log('info', 'Fetch the list of active customers routes');
  const result = await CustomerController.GetCustomers();
  if (result) {
    const response = await Utility.SuccessResponse(result);
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});


/**
 * Get customer for country code
 */
router.get('/getCustomersForCountry', async (req, res) => {
  Logger.log('info', 'Fetch the country wise list of active customers routes');
  const countryCode = req.query.country.toUpperCase();
  const result = await CustomerController.GetCustomersForCountry(countryCode);
  if (result) {
    const response = await Utility.SuccessResponse(result);
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});


/**
 * Get Premium customers
 */
router.get('/getPremiumCustomers', async (req, res) => {
  Logger.log('info', 'Fetch the list of Premium customers routes');
  const result = await CustomerController.GetPremiumCustomers();
  if (result) {
    const response = await Utility.SuccessResponse(result);
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});


/**
 * Get Customers for sms notification
 */
router.get('/getCustomersForSMS', async (req, res) => {
  Logger.log('info', 'Fetch the sms Subscribed list of active customers routes');
  const result = await CustomerController.GetCustomersForSMS();
  if (result) {
    const response = await Utility.SuccessResponse(result);
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});


/**
 * Get all active customers count
 */
router.get('/getCustomersCount', async (req, res) => {
  Logger.log('info', 'Fetch the list of Active customers count routes');
  const result = await CustomerController.GetCustomers();
  if (result) {
    const response = await Utility.SuccessResponse({ count: result.length });
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});


/**
 * Add a new customer
 */
router.post('/addCustomer', async (req, res) => {
  Logger.log('info', 'Add new customer routes');
  const opts = req.body;
  const validation = await CustomerInputValidation(opts, flag = true);
  if (validation.status === 'error') return res.status(validation.statusCode).json(validation);
  const result = await CustomerController.AddCustomers(opts);
  if (result && result.id) {
    const response = await Utility.SuccessResponse(result);
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});

/**
 * Get all active customers count
 */
 router.post('/notifyCustomer', async (req, res) => {
  Logger.log('info', 'Notify customer routes');
  const opts = req.body;
  const result = await CustomerController.NotifyCustomer(opts);
  if (result && result.success) {
    const response = await Utility.SuccessResponse(result.message);
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});

/**
 * Update Existing customer
 */
router.put('/updateCustomer', async (req, res) => {
  Logger.log('info', 'Update existing customer routes');
  const opts = req.body;
  if (!opts.id) return res.status(403).json({ message: 'Customer is should not be empty' });
  const validation = await CustomerInputValidation(opts, flag = false);
  if (validation.status === 'error') return res.status(validation.statusCode).json(validation);
  const result = await CustomerController.UpdateCustomers(opts);
  if (result) {
    const response = await Utility.SuccessResponse('Updated Successfully');
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse({ message: 'Invalid input parameter' });
    res.status(response.statusCode).json(response);
  }
});


/**
 * Delete customer
 */
router.delete('/deleteCustomer', async (req, res) => {
  Logger.log('info', 'Delete existing customer routes');
  const opts = req.body;
  const result = await CustomerController.DeleteCustomers(opts);
  if (result || result.id) {
    const response = await Utility.SuccessResponse(result);
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});


/**
 * Delete list of customers
 */
router.delete('/deleteCustomers', async (req, res) => {
  Logger.log('info', 'Delete existing customers list routes');
  const opts = req.body;
  const result = await CustomerController.DeleteCustomers(opts);
  if (result || result.id) {
    const response = await Utility.SuccessResponse('Soft Deletion completed successfully');
    res.send(response);
  } else {
    const response = await Utility.ErrorResponse(result);
    res.status(response.statusCode).json(response);
  }
});

module.exports = router;
