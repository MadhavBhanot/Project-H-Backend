const jwt = require('jsonwebtoken') // Import jsonwebtoken for decoding and verification
const User = require('../../models/User')

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      })
    }

    req.user = {
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified
    }

    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    })
  }
}

module.exports = verifyToken
