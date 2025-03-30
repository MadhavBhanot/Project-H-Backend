// Get a user's follwer list
const User = require('../../models/User')

const getFollowers = async (req, res) => {
  try {
    const { id } = req.params
    // Check if id Provided
    if (!id) {
      return res
        .status(404)
        .json({ message: 'User Id is Required', success: false })
    }

    const user = await User.findById(id).populate(
      'followers',
      'name username profileImg',
    )
    if (!user || user.blockedUsers.includes(req.user._id)) {
      return res.status(404).json({ message: 'User not found', success: false })
    }

    if (user.isPrivateAccount && !user.followers.includes(req.user._id)) {
      return res.status(200).json({
        message: 'Follower Fetched Successfully',
        followers: [],
        success: true,
      })
    }

    return res.status(200).json({
      message: 'Follower Fetched Successfully',
      followers: user.followers,
      success: true,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

module.exports = getFollowers
