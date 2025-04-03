const express = require('express')
const { saveToken } = require('../controllers/notification/saveToken')
const sendNotification = require('../controllers/notification/sendNotification')
const { verifyClerkToken } = require('../middleware/clerk/verifyToken')
const getNotification = require('../controllers/notification/getNotifications')
const markAsRead = require('../controllers/notification/markAsRead')
const deleteNotification = require('../controllers/notification/deleteNotification')
const router = express.Router()

router.use(verifyClerkToken)
router.post('/save', saveToken)
router.post('sendNotification', sendNotification)
router.get('/getNotifications', getNotification)
router.patch('/mark-as-read', markAsRead)
router.delete('/deleteNotification', deleteNotification)

module.exports = router
