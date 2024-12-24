// All the routes will be imported in here and exported as a single module

const express = require('express')
const router = express.Router()

// Import all the routes
const authRoutes = require('../routes/auth')
const postRoutes = require('../routes/post')

// Use the authentication routes under `/auth`
router.use('/api/auth', authRoutes)

// You can add other route groups here later, for example:
// router.use('/users', userRoutes);
router.use('api/posts', postRoutes)

module.exports = router
