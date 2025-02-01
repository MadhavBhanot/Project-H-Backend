const express = require('express')
const router = express.Router()

const { createUser } = require('../controllers/clerk/createUser')
const { verifyEmail } = require('../controllers/clerk/verifyEmail')
const { updateUser } = require('../controllers/clerk/updateUser')
const { deleteUser } = require('../controllers/clerk/deleteUser')
const { webhookHandler } = require('../middleware/clerk/webhook')
const { verifyClerkToken } = require('../middleware/clerk/verifyToken')

// Public routes
router.post('/createUser', createUser)
router.post('/verifyEmail', verifyEmail)

// Protected routes
router.use(verifyClerkToken)
router.post('/updateUser/:userId', updateUser)
router.delete('/deleteUser/:userId', deleteUser)

// Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler)

module.exports = router
