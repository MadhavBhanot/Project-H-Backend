const { clerkClient } = require('@clerk/express')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { email } = req.body

  try {
    // Check if the user exists in your database
    const clerkUser = await User.findOne({ email })
    if (!clerkUser) {
      return res.status(400).json({ Status: 0, Message: 'Invalid credentials' })
    }

    console.log('User found:', clerkUser, clerkUser.clerkId)

    // Issue a jwt
    const jwtToken = jwt.sign(
      { userId: clerkUser.id },
      process.env.JWT_SECRET_KEY, // Ensure this is set in your .env file
      {
        expiresIn: '100h',
      },
    )

    return res.status(200).json({
      status: 'success',
      message: 'Registration successful',
      user: {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses,
        username: clerkUser.username,
      },
      token: jwtToken,
    })
  } catch (error) {
    console.error('Error during login:', error)
    return res
      .status(500)
      .json({ Status: 0, Message: 'Something went wrong', error })
  }
}

module.exports = login
