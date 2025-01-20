const { verifyToken } = require('@clerk/express');

// Middleware to verify the token
async function verifyTokenMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the Bearer token from the Authorization header
    console.log('token....',token)
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Clerk verifyToken method
    const jwtKey = process.env.CLERK_SECRET_KEY || ''; // Set this in environment variables
    // const audience = process.env.CLERK_AUDIENCE || ''; // Optional, set this in environment variables

    const verificationOptions = {
      jwtKey, // or you can use secretKey if preferred
    //   audience, // Optional, string or array of audiences
      authorizedParties: process.env.ALLOWED_ORIGIN, // Optional, list of authorized parties
    //   clockSkewInMs: 5000, // Optional, time difference allowance in milliseconds
    };

    const verifiedToken = await verifyToken(
        token,
        verificationOptions
    );

    console.log('VerifyToken.....',verifiedToken)
    // If the token is verified successfully, you can attach the token info to the request object for future use
    req.verifiedToken = verifiedToken;

    // Call the next middleware in the stack
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token',error:error });
  }
}

module.exports = { verifyTokenMiddleware };
