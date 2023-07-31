const User = require('../models/user')
const utils = require('../lib/utils');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

// Adds new user
exports.postAddUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        // Check if email already exist
        const checkEmail = await User.findOne({
            email: email
        });
        if (checkEmail) {
            return res.status(401).json({
                message: 'Email already exist!'
            })
        }
        // Check if password and confirm password match
        if (password !== confirm_password) {
            return res.status(401).json({
                message: 'Passwords does not match!'
            })
        }
        const saltHash = utils.genPassword(password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newuser = await new User({
            name: name,
            email: email,
            hash: hash,
            salt: salt
        })
        const user = await newuser.save()
        if (newuser) {
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({
                success: true,
                user: user,
                token: tokenObject.token,
                expiresIn: tokenObject.expires
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

//  User login to the application
exports.postUserLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({
            email: email
        })
        if (!user) {
            return res.status(401).json({
                message: 'You entered the wrong credentials!'
            })
        }
        const isValid = utils.validPassword(password, user.hash, user.salt)
        if (isValid) {
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({
                success: true,
                user: user,
                token: tokenObject.token,
                expiresIn: tokenObject.expires
            })
        } else {
            return res.status(401).json({
                message: "You entered the wrong credentials!"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// User reset password
exports.postUserReset = async (req, res, next) => {
    const email = req.body.email;
    try {
        let token;
        const cryt = await crypto.randomBytes(32, (err, Buffer) => {
            if (err) {
                return res.status(401).json({
                    message: 'An unknown error occured'
                })
            }
            token = Buffer.toString('hex');
        });
        console.log(token);
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            return res.status(401).json({
                message: 'Email does not exist!'
            });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        const result = await user.save();
        const message = await transporter.sendMail({
            to: email,
            from: 'reset@invoicing.com',
            subject: 'Reset Password',
            html: `
                                   <p>Reset password request</p>
                                   <p>Dear ${user.name}</p>
                                   <p>Click this <a href='${process.env.REST_PASSWORD_URL}/${token}'>link</a> to reset your password.
                                   This link is valid for just one hour.</p>
                                `
        });
        res.status(200).json({
            message: 'Kindly check your mail for further directives. Thank you.'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// User set new password
exports.getUserNewpassword = async (req, res, next) => {
    const token = req.params.token;
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid Credentials!'
            });
        }
        res.status(200).json({
            resetToken: token,
            userId: user._id
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        });
    }
}

// User submit new password
exports.postUserNewPassword = async (req, res, next) => {
    const token = req.params.token;
    const password = req.body.password;
    const saltHash = utils.genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const userId = req.body.userId;
    try {
        const user = await User.findOne({
            _id: userId,
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials! Try again!'
            })
        }

        user.hash = hash;
        user.salt = salt;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        const result = await user.save();
        const message = await transporter.sendMail({
            to: user.email,
            from: 'success@invoicing.com',
            subject: 'Password reset successful',
            html: '<p>You have successfully changed your password!</p>'
        });
        res.status(200).json({
            message: 'Password reset successful'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}