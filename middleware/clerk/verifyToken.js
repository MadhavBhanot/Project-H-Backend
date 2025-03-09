const jwt = require('jsonwebtoken') // Import jsonwebtoken for decoding and verification
const User = require('../../models/User')

const verifyClerkToken = async (req, res, next) => {
  try {
    console.log('🔒 Verifying token for path:', req.path)
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided or invalid format');
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Processing token:', token.substring(0, 20) + '...');

    // Verify the token using the same secret as login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);

    // Get user from database
    const user = await User.findOne({ clerkId: decoded.userId }).select('-password');
    if (!user) {
      console.log('❌ User not found in database for clerkId:', decoded.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('👤 User authenticated:', {
      mongoId: user._id,
      clerkId: user.clerkId,
      username: user.username
    });

    // Attach user to request object
    req.user = user;
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    console.error('❌ Token verification error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
}

module.exports = { verifyClerkToken }
