const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path')
// All controllers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const app = express();

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();


// COnnect to DB
connectDB();

// Pass the global passport object into the configuration function
require('./config/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Allows our Flutter application to make HTTP requests to Express application
app.use(cors());

// get all routers
app.use('/api', authRouter);
app.use('/api/user', userRouter);



module.exports = app;