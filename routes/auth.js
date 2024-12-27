// Authentication routes go here

const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth/verifyToken')
const { register } = require('../controllers/auth/register')
const { resendOTP } = require('../utils/auth/resentOTP')
const { verifyOtp } = require('../utils/auth/verifyOTP')
const { login } = require('../controllers/auth/login')
const google = require('../controllers/auth/google')
const github = require('../controllers/auth/github')
const { forgetPassword } = require('../controllers/auth/forgetPassword')
const { changePassword } = require('../controllers/auth/changePassword')

router.post('/register', register)
router.post('/verify-otp', verifyOtp)
router.post('/resent-otp', resendOTP)
router.post('/login', login)
router.post('/google', google)
router.post('/github', github)
router.post('/forgot-password', forgetPassword)
router.post('/reset-password', verifyToken, changePassword)

module.exports = router
