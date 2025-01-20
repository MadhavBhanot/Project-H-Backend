// Login Controller
// const bcrypt = require('bcryptjs');
const User = require('../../models/User');
// const { generateToken, generateRefreshToken } = require('../../config/configJWT');
// const { createSignInToken } = require('../../config/configClerkJWT');
const { clerkClient } = require('@clerk/express'); 

const login = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ Status: 0, Message: 'Invalid credentials' });
    }

    console.log("userr.......", user,user.clerkId)

    // Check if the password matches
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ Status: 0, Message: 'Invalid credentials' });
    // }

    // Generate JWT token
    // const accessToken = generateToken({ userId: user._id, email: user.email });
    // const refreshToken = generateRefreshToken({ userId: user._id, email: user.email });
    const accessToken = await clerkClient.signInTokens.createSignInToken({
      userId: user.clerkId,
      expiresInSeconds: 60 * 60 * 24 * 7, // 1 week
    });

    console.log("accesToken........", accessToken);

    res.cookie('token', accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days expiration in milliseconds
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are only sent over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
    });

    return res.status(200).json({ Status: 1, Message: 'Login successful', accessToken });
  } catch (error) {
    return res.status(500).json({ Status: 0, Message: 'Something went wrong', error });
  }
};

module.exports = login 
