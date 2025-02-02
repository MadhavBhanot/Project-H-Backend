const generateToken = require('../../middleware/clerk/generateToken');
const User = require('../../models/User');

const login = async (req, res) => {
  const { email, clerkId } = req.body;

  try {
    console.log('👤 Login attempt:', { email, clerkId });

    if (!email || !clerkId) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        status: 'error',
        message: 'Email and clerkId are required'
      });
    }

    // Check if the user exists in your database
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Verify clerkId matches
    if (user.clerkId !== clerkId) {
      console.log('❌ ClerkId mismatch');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    console.log('✅ User found:', {
      id: user._id,
      email: user.email,
      clerkId: user.clerkId
    });

    // Generate JWT token
    const token = await generateToken(res, user.clerkId);

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          clerkId: user.clerkId
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Error during login:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = login;
