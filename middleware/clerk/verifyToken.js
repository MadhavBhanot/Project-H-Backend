const jwt = require('jsonwebtoken') // Import jsonwebtoken for decoding and verification

const verifyClerkToken = async (req, res, next) => {
  const token =
    req.headers.authorization?.split(' ')[1] || req.cookies?.__clerk_token
  console.log('token', token)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token is missing' })
  }

  try {
    // Decode the JWT without verifying it
    const decoded = jwt.decode(token, { complete: true })

    if (!decoded) {
      console.log('Invalid token')
    } else {
      console.log('Decoded token:', decoded)
      // Accessing the header and payload
      console.log('Header:', decoded.header)
      console.log('Payload:', decoded.payload)
    }
    req.userId = decoded.payload.userId
    console.log('req.userId', req.userId)
    next()
  } catch (error) {
    console.error('Error decoding token:', error)
  }
}

module.exports = { verifyClerkToken }
