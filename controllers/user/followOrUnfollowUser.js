// Follow or Unfollow a user both actions will be handled here
const User = require('../../models/User')

// Follow or Unfollow a user
const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params // The user to be followed/unfollowed
    // Check if id Provided
    if (!id) {
      return res.status(404).json({ Status: 0, Message: 'User Id is Required' })
    }

    const currentUserId = req.user._id // The user performing the action
    if (!currentUserId) {
      return res
        .status(404)
        .json({ Status: 0, Message: 'Current User Id Rquired' })
    }

    const user = await User.findById(id)
    const currentUser = await User.findById(currentUserId)

    if (!user || !currentUser || user.blockedUsers.includes(currentUserId)) {
      return res.status(404).json({ message: 'User not found', success: false })
    }

    // Check if the user is trying to follow itself
    if (user._id.equals(currentUser._id)) {
      return res
        .status(400)
        .json({ message: 'Cannot follow yourself', success: false })
    }

    // Check if currentUser is already following the user
    if (user.followers.includes(currentUser._id)) {
      // Unfollow the user
      user.followers.pull(currentUser._id)
      currentUser.following.pull(user._id)

      await user.save()
      await currentUser.save()

      return res
        .status(200)
        .json({ message: 'User unfollowed successfully', success: true })
    } else {
      // Follow the user
      user.followers.push(currentUser._id)
      currentUser.following.push(user._id)

      await user.save()
      await currentUser.save()

      return res
        .status(200)
        .json({ message: 'User followed successfully', success: false })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

module.exports = followUnfollowUser
