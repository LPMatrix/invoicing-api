const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone_no: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    address: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    added_on : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Customer", customerSchema);