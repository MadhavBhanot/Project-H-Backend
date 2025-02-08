const express = require('express')
const router = express.Router()

// Routes

router.use('/auth', require('../routes/auth'))
router.use('/posts', require('../routes/post'))
// router.use('/jobs', require('../routes/job'))
router.use('/users', require('../routes/user'))
router.use('/comments', require('../routes/comment'))
router.use('/clerk', require('../routes/clerk'))

// Log registered routes
console.log('📍 Registered API Routes:')
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(
      `   ${Object.keys(r.route.methods).join(', ').toUpperCase()}: ${
        r.route.path
      }`,
    )
  } else if (r.name === 'router') {
    r.handle.stack.forEach((nestedRoute) => {
      if (nestedRoute.route) {
        const basePath = r.regexp.source
          .replace('\\/?(?=\\/|$)', '')
          .replace('^\\/', '/')
        console.log(
          `   ${Object.keys(nestedRoute.route.methods)
            .join(', ')
            .toUpperCase()}: ${basePath}${nestedRoute.route.path}`,
        )
      }
    })
  }
})

module.exports = router
