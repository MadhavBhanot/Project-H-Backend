const jwt = require('jsonwebtoken') // Import jsonwebtoken for decoding and verification
const User = require('../../models/User')

const verifyClerkToken = async (req, res, next) => {
  const token =
    req.headers.authorization?.split(' ')[1] || req.cookies?.__clerk_token
  console.log('token', token)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token is missing' })
  }

  try {
    // Decode the JWT without verifying it
    const decoded = jwt.decode(token, { complete: true })

    if (!decoded) {
      console.log('Invalid token')
    } else {
      console.log('Decoded token:', decoded)
      // Accessing the header and payload
      console.log('Header:', decoded.header)
      console.log('Payload:', decoded.payload)
    }
    req.userId = decoded.payload.userId
    console.log('req.userId', req.userId)

    // Fetch the user from the database based on `clerkId`
    const user = await User.findOne({ clerkId: req.userId }).select('email username _id');
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }

    // Attach the user details to the request object (excluding sensitive info)
    req.user = {
        userId: user._id,
        username: user.username,
        email: user.email
    };


    next()
  } catch (error) {
    console.error('Error decoding token:', error)
  }
}

module.exports = { verifyClerkToken }
