/**
 * Mongoose schema file to define collection
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CustomerSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        notification: {
            type: [String],
            required: true
        },
        premium: {
            type: Boolean,
            default: false,
            required: false
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { versionKey: false },
    { timestamps: true },
    { collection: 'customer' }
);

module.exports = mongoose.model('Customer', CustomerSchema);

