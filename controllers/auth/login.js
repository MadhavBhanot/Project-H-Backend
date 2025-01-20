const { clerkClient } = require('@clerk/express')
const User = require('../../models/User')

const login = async (req, res) => {
  const { email } = req.body

  try {
    // Check if the user exists in your database
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ Status: 0, Message: 'Invalid credentials' })
    }

    console.log('User found:', user, user.clerkId)

    // Generate a sign-in token with the Clerk JWT template
    const tokenResponse = await clerkClient.signInTokens.createSignInToken({
      userId: user.clerkId, // Clerk user ID from your database
      expiresInSeconds: 60 * 60 * 24 * 7, // 1 week expiry
    })

    const accessToken = tokenResponse.token

    console.log('Generated access token:', accessToken)

    // Set the token as an HTTP-only cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return res
      .status(200)
      .json({ Status: 1, Message: 'Login successful', accessToken, user })
  } catch (error) {
    console.error('Error during login:', error)
    return res
      .status(500)
      .json({ Status: 0, Message: 'Something went wrong', error })
  }
}

module.exports = login
