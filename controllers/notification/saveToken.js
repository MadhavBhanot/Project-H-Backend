const User = require('../../models/User')

const saveToken = async (req, res) => {
  try {
    const { pushNotificationToken } = req.body

    if (!pushNotificationToken) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Expo Notification Token are required.',
      })
    }

    // Find user and update their pushNotificationToken
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { pushNotificationToken },
      { new: true },
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Expo Notification Token saved successfully.',
      user,
    })
  } catch (error) {
    console.error('Error saving Expo Notification Token:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

module.exports = { saveToken }
