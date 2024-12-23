const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { generateToken } = require('../../config/configJWT');
const { sendOTP } = require('../../config/configSMTP');
const crypto = require('crypto');

// Temporary storage for OTP (This can be replaced with Redis or DB for production)
let otpStorage = {};

const register = async (req, res) => {
    const { name, username, email, password, phoneNumber } = req.body;
  
    // Regular expression to enforce password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  
    try {
      // Validate password format
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          Status: 0,
          Message: 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ Status: 0, Message: 'User already exists' });
      }
  
      // Hash the password before saving it to DB
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the user in DB
      const newUser = new User({
        name,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        isVerified: false, // Initially not verified
      });
  
      // Save the user
      await newUser.save();
  
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999); // Generate 6-digit OTP
  
      // Send OTP to user's email
      await sendOTP(email, otp);
  
      // Store the OTP temporarily (e.g., in memory, database, or Redis)
      otpStorage[email] = { otp, expiresIn: Date.now() + 10 * 60 * 1000 }; // OTP expires in 10 mins
  
      return res.status(201).json({
        Status: 1,
        Message: 'User registered successfully. Please check your email for OTP verification',
      });
    } catch (error) {
      return res.status(500).json({ Status: 0, Message: 'Something went wrong', error });
    }
  };
  

// Function to handle OTP resending
const resendOTP = async ( req, res) => {
    const { email } = req.body;
    try {
        // Find the user by their ID (you can also find by email if you prefer)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({Status:0, Message: 'User Not Found' });
        }

        // Generate a new OTP
        const otp =  crypto.randomInt(100000, 999999);

        // Store the new OTP in the user's record (you should have an OTP field and OTP expiry logic)
        otpStorage[email] = { otp, expiresIn: Date.now() + 10 * 60 * 1000 };

        // Send the OTP to the user's email
        await sendOTP(email, otp);

        return res.status(200).json({
            Status:1,  
            Message: 'OTP resent successfully'
          });

    } catch (error) {
        return res.status(500).json({Status:0, Message: 'Something went wrong', error });
    }
}

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtpData = otpStorage[email];

    // Check if OTP exists and has not expired
    if (!storedOtpData || storedOtpData.expiresIn < Date.now()) {
      return res.status(400).json({Status:0, Message: 'OTP has expired or invalid' });
    }

    // Check if OTP is correct
    if (parseInt(otp) !== storedOtpData.otp) {
      return res.status(400).json({Status:0, Message: 'Invalid OTP' });
    }

    // Update user to verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ Status:0,Message: 'User not found' });
    }

    // Generate JWT token after successful OTP verification
    const token = generateToken({ userId: user._id, email: user.email });

    user.isVerified = true;
    await user.save();

    return res.status(200).json({Status:1, Message: 'User verified successfully', token });
  } catch (error) {
    return res.status(500).json({Status:0, Message: 'Something went wrong', error });
  }
};

module.exports = { register, resendOTP, verifyOtp };
