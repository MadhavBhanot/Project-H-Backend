const generateToken = require('../../middleware/clerk/generateToken');
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

    // Generate a sign-in token 
    const jwtToken = await generateToken(res, user.clerkId)
    console.log("Token....",jwtToken)

    return res
      .status(200)
      .json({ Status: 1, Message: 'Login successful',user, token: jwtToken })
  } catch (error) {
    console.error('Error during login:', error)
    return res
      .status(500)
      .json({ Status: 0, Message: 'Something went wrong', error })
  }
}

module.exports = login
