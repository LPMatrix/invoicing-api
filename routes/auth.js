const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.postAddUser);

router.post('/login', authController.postUserLogin);

router.post('/user/reset', authController.postUserReset);

router.get('/user/reset/:token', authController.getUserNewpassword);

router.post('/user/reset/:token', authController.postUserNewPassword);


module.exports = router;