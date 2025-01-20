const express = require('express')
const router = express.Router()

const { createUser } = require('../controllers/clerk/createUser')
const { updateUser } = require('../controllers/clerk/updateUser')
const { deleteUser } = require('../controllers/clerk/deleteUser')
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node')

router.use(ClerkExpressWithAuth())
router.post('/createUser', createUser)
router.post('/updateUser/:userId', updateUser)
router.delete('/deleteUser/:userId', deleteUser)

module.exports = router
