const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { clerkId, email, username, firstName, lastName, imageUrl } = req.body;

    console.log('👤 Login attempt:', { clerkId, email });

    // Try to find existing user
    let user = await User.findOne({ clerkId });

    // If user doesn't exist, create a new one
    if (!user) {
      console.log('🆕 Creating new user:', { clerkId, email });
      user = new User({
        clerkId,
        email,
        username: username || email.split('@')[0],
        firstName,
        lastName,
        profileImg: imageUrl
      });
      await user.save();
      console.log('✅ New user created:', user._id);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.clerkId },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('🔑 Login successful for user:', user._id);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          profileImg: user.profileImg,
          clerkId: user.clerkId
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
};

module.exports = login;
