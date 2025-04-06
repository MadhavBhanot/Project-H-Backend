const Notification = require('../../models/Notification')

// Mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body
    const userId = req.user._id
    if (!userId || !notificationIds || !notificationIds.length) {
      return res.status(400).json({ error: 'Invalid request data.' })
    }

    await Notification.updateMany(
      { userId, _id: { $in: notificationIds } },
      { isRead: true },
    )

    return res.status(200).json({
      success: true,
      message: 'Notifications marked as read',
    })
  } catch (error) {
    console.error('Error marking notifications:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = markAsRead
