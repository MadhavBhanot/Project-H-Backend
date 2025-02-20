const User = require('../../models/User')

const discoverPeople = async (req, res) => {
  try {
    const { id: userId } = req.params // Get userId from request params
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Get the user's interests
    const userInterests = user.interests || []

    // Find users with at least one matching interest, exclude current user & already-followed users
    const suggestedUsers = await User.find({
      _id: { $ne: userId, $nin: user.following }, // Exclude self and already followed users
      interests: { $in: userInterests }, // Find users with matching interests
      isPrivateAccount: false, // Only suggest public accounts
    })
      .select('firstName lastName username profileImg bio interests') // Select relevant fields
      .limit(10) // Limit results to 10 users

    res.status(200).json(suggestedUsers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { discoverPeople }
