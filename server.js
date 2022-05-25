const express = require('express');
const mongoose = require('mongoose');
const { Environment } = require('./config/index');
const { Logger } = require('./helpers/index');
const { CustomerRoutes, UserRoutes } = require('./routes/index');
const { UserModel } = require('./Models/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();

app.use(express.json({ limit: '50mb', type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));

app.use('/', async (req, res, next) => {
    // Middleware to validate the correct origin
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
    }
    Logger.log('info', `Middleware running: ${req.hostname}`);
    next();
});

// Database connection
mongoose.Promise = global.Promise;
mongoose.connect(Environment.mongoURI);
const db = mongoose.connection;
db.on('error', () => Logger.log('error', 'Failed to connect to Database'));
db.once('open', () => Logger.log('info', 'MongoDB is running'));

// Pre Populate the users information to database
UserModel.PopulateUserData();

app.use('/api/customer/auth', UserRoutes);
app.use('/api/customer', CustomerRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('host', Environment.hostname);
app.set('port', Environment.port);

app.listen(app.get('port'), () => {
    Logger.log('info', `App is running at ${app.get('host')}:${app.get('port')}`);
});

module.exports = app;
