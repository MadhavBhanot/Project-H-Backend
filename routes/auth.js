const express = require('express')
const router = express.Router()

const login = require('../controllers/auth/login')
const google = require('../controllers/auth/google')
const github = require('../controllers/auth/github')
const forgetPassword = require('../controllers/auth/forgetPassword')
const changePassword = require('../controllers/auth/changePassword')

router.post('/login', login)
router.post('/google', google)
router.post('/github', github)
// router.post('/forgot-password', forgetPassword)
// router.post('/reset-password', verifyToken, changePassword)

module.exports = router
