const User = require('../../models/User');
const generateToken = require('../../middleware/clerk/generateToken');

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    console.log('Verifying email:', { email });

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if verification code exists and hasn't expired
    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found'
      });
    }

    // Check if code has expired
    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Verify the code
    if (user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    console.log('User email verified:', {
      mongoId: user._id
    });

    // Generate new token
    const token = await generateToken(res, user._id);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        isVerified: true
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: error.message
    });
  }
};

module.exports = { verifyEmail }; 