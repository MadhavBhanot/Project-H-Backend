const express = require('express')
const router = express.Router()

router.post('/save', (req, res) => {
  console.log('Nice')
})

module.exports = router
