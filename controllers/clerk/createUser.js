const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const generateToken = require('../../middleware/clerk/generateToken');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  }
});

const createUser = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  try {
    // Check if user exists in MongoDB
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      console.log('User already exists:', { email, username });
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 
          'Email already in use' : 
          'Username already taken'
      });
    }

    console.log('Creating user:', { email, firstName, lastName, username });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create user in MongoDB
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await newUser.save();
    console.log('User created in MongoDB:', newUser._id);

    // Send verification email
    try {
      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Verify your email',
        html: `
          <h1>Email Verification</h1>
          <p>Your verification code is: <strong>${verificationCode}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification email sent:', { email, verificationCode });

      // Generate initial token
      const token = await generateToken(res, newUser._id);

      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your email',
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          username: newUser.username,
          isVerified: false
        },
        token
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      
      // If email fails, still return success but with a warning
      const token = await generateToken(res, newUser._id);
      
      return res.status(200).json({
        success: true,
        message: 'User created but verification email failed to send',
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          username: newUser.username,
          isVerified: false
        },
        token
      });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

module.exports = { createUser };
