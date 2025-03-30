const User = require('../../models/User')

// Get user details by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    // Check if ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'User ID is required' })
    }

    const user = await User.findById(id).select('-password') // Exclude password

    if (!user || user.blockedUsers.includes(req.user._id)) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // If user is private, return limited information
    if (user.isPrivateAccount) {
      return res.status(200).json({
        success: true,
        message: 'User Found (Private Account)',
        data: {
          _id: user._id,
          username: user.username,
          profileImg: user.profileImg,
          bio: user.bio,
          followers: user.followers.length,
          following: user.following.length,
        },
      })
    }

    return res.status(200).json({
      success: true,
      message: 'User Found',
      data: user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    })
  }
}

module.exports = getUserById
