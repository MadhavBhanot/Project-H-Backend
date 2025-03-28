const { clerkClient } = require('@clerk/express')
const generateToken = require('../../middleware/clerk/generateToken');
const User = require('../../models/User');

// Create a new user in Clerk and create a session
const createUser = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body

  try {
    // Create a user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      username,
      password,
    })
    
    // Find or create MongoDB user record
    let mongoUser = await User.findOne({ email });
    
    if (!mongoUser) {
      // Create MongoDB user if not exists
      mongoUser = await User.create({
        username,
        email,
        firstName,
        lastName,
        clerkId: clerkUser.id
      });
      console.log('Created MongoDB user record:', mongoUser._id);
    } else {
      // Update existing user with Clerk ID
      mongoUser.clerkId = clerkUser.id;
      await mongoUser.save();
      console.log('Updated existing MongoDB user with Clerk ID:', mongoUser._id);
    }

    // Generate JWT token using MongoDB ID
    const jwtToken = await generateToken(res, mongoUser._id)
    
    // Log the JWT token to ensure it's being issued properly
    console.log('JWT Token generated for MongoDB user:', mongoUser._id)

    return res.status(200).json({
      status: 'success',
      message: 'Registration successful',
      user: {
        id: clerkUser.id,
        mongoId: mongoUser._id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.username,
      },
      token: jwtToken,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({
      status: 'error',
      message: 'Error creating user',
      error: error.message,
    })
  }
}

module.exports = { createUser }
