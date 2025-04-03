const express = require('express')
const getPresignedUrl = require('../controllers/aws/getPresignedUrl')
const { verifyClerkToken } = require('../middleware/clerk/verifyToken.js')

const router = express.Router()

router.use(verifyClerkToken)
router.get('/get-signed-url', getPresignedUrl)

module.exports = router
