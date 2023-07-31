const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    hash: {
        type: String
    },
    salt: {
        type: String
    },
    
    image : {
        type : String,
    },
    created_on : {
        type : Date,
        default: Date.now()
    },
    is_active : {
        type : Boolean,
        default: true
    },
    otp: String,
    otpExpirationTime: Date,
    resetToken: String,
    resetTokenExpiration: Date
})

module.exports = mongoose.model('User', userSchema);