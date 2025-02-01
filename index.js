const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')

const { connectDB } = require('./config/configDB')
const logger = require('./utils/main/logger')
const apiRoutes = require('./routes/api')
const { webhookHandler } = require('./middleware/clerk/webhook')
const { verifyClerkToken } = require('./middleware/clerk/verifyToken')

const app = express()

// Add this line before other middleware
app.set('trust proxy', 1);  // Trust first proxy

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 350, // Limit each IP to 350 requests
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: { message: 'Too Many Requests, Try Again in 10 minutes' },
})

// Security Middlwares
app.use(helmet())
app.use(cors())
app.use(limiter)

// Request Body Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())

// Logging Middleware
app.use(logger) // Logging Requests To Access Log

// Images Middleware
app.use(express.static(path.resolve('./public')))

const PORT = process.env.PORT || 5001

connectDB()

//All API Routes
app.use(apiRoutes)
// Route to check the user profile
app.get('/api/profile', verifyClerkToken, (req, res) => {
  res.json({
    message: 'User profile retrieved successfully',
    userId: req.userId, // You can fetch and attach more user data if required
  })
})

app.all('*', (req, res) => {
  res
    .status(404)
    .json({ message: `${req.originalUrl} is not found on this server` })
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
