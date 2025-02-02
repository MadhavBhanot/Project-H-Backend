const express = require('express')
const router = express.Router()

const { createUser } = require('../controllers/clerk/createUser')
const { updateUser } = require('../controllers/clerk/updateUser')
const { deleteUser } = require('../controllers/clerk/deleteUser')
const { getUser } = require('../controllers/clerk/getUser')
const { verifyClerkToken } = require('../middleware/clerk/verifyToken')

router.post('/createUser', createUser)
router.use(verifyClerkToken)
router.get('/user/:clerkId', getUser)
router.post('/updateUser/:userId', updateUser)
router.delete('/deleteUser/:userId', deleteUser)

module.exports = router
