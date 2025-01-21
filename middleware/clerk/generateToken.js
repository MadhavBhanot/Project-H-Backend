const jwt = require('jsonwebtoken');

/**
 * Helper function to generate a JWT token and set it in an HTTP-only cookie.
 * 
 * @param {object} res - The Express.js response object.
 * @param {string} userId - The user's Clerk ID or any unique identifier.
 * @returns {string} - Returns the generated JWT token.
 */
const generateToken = (res, userId) => {
  try {
    // Generate the JWT token
    const jwtToken = jwt.sign(
      { userId }, // Payload with the user ID
      process.env.JWT_SECRET_KEY, // Secret key from the environment variable
      { expiresIn: '100h' } // Token expiration time
    );

    // Set the JWT token in an HTTP-only cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,          // Prevents client-side JS access to the cookie
      maxAge: 3 * 24 * 60 * 60 * 1000, // Cookie expiration time (3 days)
      secure: process.env.NODE_ENV === 'production', // Use secure cookie in production (HTTPS)
      sameSite: 'strict',      // Protect against CSRF attacks
    });

    // Log the generated token for debugging purposes
    console.log('Generated JWT Token:', jwtToken);

    // Return the token
    return jwtToken;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

module.exports = generateToken;
