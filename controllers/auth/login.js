const bcrypt = require('bcryptjs');
const generateToken = require('../../middleware/clerk/generateToken');
const User = require('../../models/User');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please verify your email first' 
      });
    }

    // Generate token
    const token = await generateToken(res, user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Something went wrong', 
      error: error.message 
    });
  }
};

module.exports = login;
