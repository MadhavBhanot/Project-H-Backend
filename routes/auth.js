// Authentication routes go here

const express = require('express');
const router = express.Router();
const { register, verifyOtp, resendOTP} = require('../controllers/auth/register');
const { login } = require('../controllers/auth/login');

router.post('/register', register);
router.post('/verify-otp', verifyOtp); 
router.post('/resent-otp', resendOTP) 
router.post('/login', login);

module.exports = router;
