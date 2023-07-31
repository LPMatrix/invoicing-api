const mongoose = require('mongoose');
require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 * DB_STRING_PROD=<your production database string>
 */

const devConnection = process.env.DB_STRING;
const prodConnection = process.env.DB_STRING_PROD;
let connectDB;
// Connect to the correct environment database
if (process.env.NODE_ENV === 'production') {
    connectDB = async () => {
        try {
            const conn = await mongoose.connect(prodConnection, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    }
} else {
    connectDB = async () => {
        try {
            const conn = await mongoose.connect(devConnection, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    }
}


module.exports = connectDB;