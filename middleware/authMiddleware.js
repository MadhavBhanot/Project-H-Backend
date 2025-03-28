const { verifyClerkToken } = require('./clerk/verifyToken');

// Auth middleware that wraps clerk token verification
const requireAuth = async (req, res, next) => {
  try {
    // Use the existing Clerk token verification middleware
    return verifyClerkToken(req, res, next);
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error during authentication' 
    });
  }
};

module.exports = { requireAuth }; 