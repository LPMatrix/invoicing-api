const User = require('../models/user');
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator');
const {encode, decode} = require('../util/crypto')
const AWS = require('aws-sdk');
const crypto = require('crypto')

function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

exports.sendOtpToPhone = async () => {
    // SEND OTP TO PHONE
    try{
  
        if(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY){
          const response={"Status":"Failure","Details":"OTP for phone is not available right now"}
          return res.status(503).send(response) 
        }
    
        const {phone_number,type} = req.body;
    
        let phone_message
    
        if(!phone_number){
          const response={"Status":"Failure","Details":"Phone Number not provided"}
          return res.status(400).send(response) 
        }
        if(!type){
          const response={"Status":"Failure","Details":"Type not provided"}
          return res.status(400).send(response) 
        }
    
        //Generate OTP 
        const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
        const now = new Date();
        const expiration_time = AddMinutesToDate(now,10);
        
        
        //Create OTP instance in DB
        const otp_instance = await OTP.create({
          otp: otp,
          expiration_time: expiration_time
        });
      
        // Create details object containing the phone number and otp id
        var details={
          "timestamp": now, 
          "check": phone_number,
          "success": true,
          "message":"OTP sent to user",
          "otp_id": otp_instance.id
        }
        
        // Encrypt the details object
        const encoded= await encode(JSON.stringify(details))
        
        //Choose message template according type requested
        if(type){
          if(type=="VERIFICATION"){
            const message = require('../templates/sms/phone_verification');
            phone_message=message(otp)
          }
          else if(type=="FORGET"){
            const message = require('../templates/sms/phone_forget');
            phone_message=message(otp)
          }
          else if(type=="2FA"){
            const message = require('../templates/sms/phone_2FA');
            phone_message=message(otp)
          }
          else{
            const response={"Status":"Failure","Details":"Incorrect Type Provided"}
            return res.status(400).send(response) 
          }
        }
    
        // Settings Params for SMS
        var params = {
          Message: phone_message,
          PhoneNumber:  phone_number
        };
    
        //Send the params to AWS SNS using aws-sdk
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    
        //Send response back to the client if the message is sent
        publishTextPromise.then(
            function (data) {
                return res.send({"Status":"Success","Details":encoded});
            }).catch(
            function (err) {
                return res.status(400).send({"Status":"Failure","Details": err });
        });
      }
      catch(err){
        const response={"Status":"Failure","Details": err.message}
        return res.status(400).send(response)
      }

}

exports.sendOtpToEmail = () => {
    // ...
}

exports.verifyOtp = () => {
    // ...
}