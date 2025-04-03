const express = require('express')
const { saveToken } = require('../controllers/notification/saveToken')
const sendNotification = require('../controllers/notification/sendNotification')
const { verifyClerkToken } = require('../middleware/clerk/verifyToken')
const getNotification = require('../controllers/notification/getNotifications')
const router = express.Router()

router.use(verifyClerkToken)
router.post('/save', saveToken)
router.post('sendNotification', sendNotification)
router.get('/getNotifications', getNotification)

module.exports = router
