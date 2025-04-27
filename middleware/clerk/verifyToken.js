const jwt = require('jsonwebtoken') // Import jsonwebtoken for decoding and verification
const User = require('../../models/User')

const verifyClerkToken = async (req, res, next) => {
  try {
    console.log('🔒 Verifying token for path:', req.path)

    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided or invalid format')
      return res
        .status(401)
        .json({ message: 'Unauthorized: Token is missing or invalid format' })
    }

    const token = authHeader.split(' ')[1]
    console.log('🔑 Processing token:', token.substring(0, 20) + '...')

    let decoded = null
    let jwtSecret = null

    // Try both JWT_SECRET and JWT_SECRET_KEY for maximum compatibility
    try {
      jwtSecret = process.env.JWT_SECRET
      console.log('🔐 First trying JWT_SECRET:', jwtSecret.substring(0, 5) + '...')
      decoded = jwt.verify(token, jwtSecret)
      console.log('✅ Token verified with JWT_SECRET')
    } catch (firstError) {
      console.log('⚠️ JWT_SECRET verification failed:', firstError.message)
      
      try {
        jwtSecret = process.env.JWT_SECRET_KEY
        console.log('🔐 Now trying JWT_SECRET_KEY:', jwtSecret.substring(0, 5) + '...')
        decoded = jwt.verify(token, jwtSecret)
        console.log('✅ Token verified with JWT_SECRET_KEY')
      } catch (secondError) {
        console.log('❌ JWT_SECRET_KEY verification also failed:', secondError.message)
        throw secondError // Rethrow the error to be caught by the outer catch block
      }
    }

    console.log('✅ Token decoded successfully:', decoded)
    
    const userId = decoded.userId

    // Get user from database by MongoDB ID
    let user = await User.findById(userId).select('-password')

    // If not found by MongoDB ID, try other fallback methods
    if (!user) {
      // Try Clerk ID as fallback (for backwards compatibility)
      console.log(
        '🔍 User not found by MongoDB ID, trying as Clerk ID:',
        userId,
      )
      user = await User.findOne({ clerkId: userId }).select('-password')

      if (user) {
        console.log('✅ User found using Clerk ID:', user._id)
      }
    }

    // If still not found, check for an email parameter
    if (!user && req.query.email) {
      console.log('🔍 User not found by IDs, trying email:', req.query.email)
      user = await User.findOne({ email: req.query.email }).select('-password')
      if (user) {
        console.log('✅ User found by email:', user.email)
      }
    }

    if (!user) {
      console.log('❌ User not found in database for ID:', userId)
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('👤 User authenticated:', {
      mongoId: user._id,
      clerkId: user.clerkId,
      username: user.username,
    })

    // Attach user to request object
    req.user = user
    req.userId = user._id // Use the MongoDB ID

    next()
  } catch (error) {
    console.error('❌ Token verification error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    return res
      .status(500)
      .json({ message: 'Internal server error during authentication' })
  }
}

module.exports = { verifyClerkToken }
