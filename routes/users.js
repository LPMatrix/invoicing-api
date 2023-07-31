const express = require('express');

const router = express.Router();

const userController = require('../controllers/users');

const passport = require('passport');

const isUserAuth = require('../middlewares/isUserAuth');

// Customer routes

router.post('/add-customer', [passport.authenticate('user', {session: false}), isUserAuth], userController.postAddCustomerByUserId);

router.get('/customers', [passport.authenticate('user', {session: false}), isUserAuth], userController.getAllCustomersByUserId);

router.get('/customer/:customerId', [passport.authenticate('user', {session: false}), isUserAuth], userController.getCustomerByCustomerId);

router.post('/customer/:customerId', [passport.authenticate('user', {session: false}), isUserAuth], userController.postUpdateCustomerByUserId);

router.delete('/customer/:customerId', [passport.authenticate('user', {session: false}), isUserAuth], userController.deleteCustomerByCustomerId);


// Product routes

router.post('/add-product', [passport.authenticate('user', {session: false}), isUserAuth], userController.postAddProductByUserId);

router.get('/products', [passport.authenticate('user', {session: false}), isUserAuth], userController.getAllProductsByUserId);

router.get('/product/:productId', [passport.authenticate('user', {session: false}), isUserAuth], userController.getProductByProductId);

router.post('/product/:productId', [passport.authenticate('user', {session: false}), isUserAuth], userController.postUpdateProductByUserId);

router.delete('/product/:productId', [passport.authenticate('user', {session: false}), isUserAuth], userController.deleteProductByProductId);

// Invoice routes

router.post('/add-invoice', [passport.authenticate('user', {session: false}), isUserAuth], userController.postAddInvoice);

router.get('/invoices', [passport.authenticate('user', {session: false}), isUserAuth], userController.getAllInvoiceByUserId);

router.get('/invoice/:invoiceId', [passport.authenticate('user', {session: false}), isUserAuth], userController.getInvoiceByInvoiceId);

router.get('/customer/invoice/:customerId', [passport.authenticate('user', {session: false}), isUserAuth], userController.getAllInvoiceByCustomerId);

router.delete('/invoice/:invoiceId', [passport.authenticate('user', {session: false}), isUserAuth], userController.deleteInvoiceByInvoiceId);


module.exports = router;