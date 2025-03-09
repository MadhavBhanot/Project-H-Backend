const User = require('../../models/User')

const discoverPeople = async (req, res) => {
  try {
    console.log('\n🔍 DISCOVER PEOPLE ENDPOINT HIT')

    // Debug: Log the MongoDB connection state
    console.log('MongoDB connection state:', User.db.readyState)

    // Get all users from MongoDB
    const allUsers = await User.find()
    console.log('📊 Raw MongoDB users:', allUsers)

    // Basic transformation
    const suggestedUsers = allUsers.map(user => ({
      _id: user._id,
      username: user.username,
      profileImg: user.profileImg,
      bio: user.bio || `Hi, I'm ${user.username}!`,
      email: user.email
    }))

    console.log('✅ Found users:', suggestedUsers.map(u => ({
      id: u._id,
      username: u.username,
      email: u.email
    })))

    return res.status(200).json(suggestedUsers)
  } catch (error) {
    console.error('❌ Error in discoverPeople:', error)
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message
    })
  }
}

module.exports = discoverPeople 
