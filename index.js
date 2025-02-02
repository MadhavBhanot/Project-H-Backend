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

// Enable trust proxy
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 350, // Limit each IP to 350 requests
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: { message: 'Too Many Requests, Try Again in 10 minutes' },
})

// Security Middlwares
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:19000', 'http://localhost:19001', 'http://10.0.2.2:19000', 'http://10.0.2.2:19001'],
  credentials: true
}))
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

// Connect to MongoDB
connectDB()

// Mount API routes under /api
app.use('/api', apiRoutes)

// Route to check the user profile
app.get('/api/profile', verifyClerkToken, (req, res) => {
  res.json({
    message: 'User profile retrieved successfully',
    userId: req.userId,
  })
})

// Clerk Webhook endpoint (only apply webhook handler here)
app.post('/api/webhook', webhookHandler)

// 404 handler
app.all('*', (req, res) => {
  console.log('❌ 404 Not Found:', req.originalUrl);
  res
    .status(404)
    .json({ message: `${req.originalUrl} is not found on this server` })
})

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Server is running on http://localhost:${PORT}
📍 API endpoint: http://localhost:${PORT}/api
🔒 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});
