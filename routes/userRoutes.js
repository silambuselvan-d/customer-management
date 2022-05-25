/**
 * Routes file to handle user authentication
 */
const express = require('express');
const { UserController } = require('../controllers/index');
const { Logger, Utility } = require('../helpers/index');

const router = express.Router();

/**
 * Login routes
 */
router.post('/login', async (req, res) => {
    Logger.log('info', 'Login routes');
    const opts = req.body;
    const result = await UserController.LoginUser(opts);
    if(result.statusCode) {
        const response = await Utility.ErrorResponse(result);
        res.status(response.statusCode).json(response);
    } else {
        const response = await Utility.SuccessResponse(result);
        res.send(response);
    }
});

module.exports = router;

