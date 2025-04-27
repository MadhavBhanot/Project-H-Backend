const jwt = require('jsonwebtoken')

/**
 * Helper function to generate a JWT token
 *
 * @param {object} res - The Express.js response object.
 * @param {string} userId - The user's Clerk ID or any unique identifier.
 * @returns {string} - Returns the generated JWT token.
 */
const generateToken = (res, userId) => {
  try {
    // Get the secret key - Important to use the same one used in verification
    const jwtSecret = process.env.JWT_SECRET
    console.log('🔐 Using secret for token generation:', jwtSecret.substring(0, 5) + '...')
    
    // Generate the JWT token
    const jwtToken = jwt.sign(
      { userId }, // Payload with the user ID
      jwtSecret,  // Using the explicitly defined JWT_SECRET
      { expiresIn: '100h' }, // Token expiration time
    )

    // Log the generated token for debugging purposes
    console.log('🔑 Generated JWT Token:', {
      userId,
      tokenLength: jwtToken.length,
      tokenPrefix: jwtToken.substring(0, 20) + '...',
    })

    // Return the token
    return jwtToken
  } catch (error) {
    console.error('❌ Error generating token:', error)
    throw new Error('Failed to generate token')
  }
}

module.exports = generateToken
