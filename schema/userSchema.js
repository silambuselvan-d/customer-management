/**
 * Mongoose schema file to define collection
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    loginId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    superUser: {
        type: Boolean,
        required: true
    }
}, { timestamps: true }, { collection: 'user' });

module.exports = mongoose.model('User', UserSchema);
