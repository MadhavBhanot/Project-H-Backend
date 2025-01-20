const { clerkClient } = require('@clerk/express')

// Create a new user in Clerk and save the user data in MongoDB
const createUser = async (req, res) => {
  const { username, email, password, firstName, lastName, phoneNumber } =
    req.body
  try {
    // Create a user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      // phoneNumber:[phoneNumber],
      username,
      password, // Min 8 Character Required
    })

    console.log('ClerkUser User data', clerkUser)
    // Generate a sign-in token with the Clerk JWT template
    const tokenResponse = await clerkClient.signInTokens.createSignInToken({
      userId: clerkUser.id, // Clerk user ID from your database
      expiresInSeconds: 60 * 60 * 24 * 7, // 1 week expiry
    })

    if (!tokenResponse) {
      return res.status(400).json({ message: 'Failed to create sign-in token' })
    }

    const accessToken = tokenResponse.token

    console.log('Generated access token:', accessToken)

    // Set the token as an HTTP-only cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return res.status(200).json({
      Status: 1,
      Message: 'Registration successful',
      accessToken,
      clerkUser,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res
      .status(500)
      .json({ message: 'Error creating user', error: error.message })
  }
}

module.exports = { createUser }
