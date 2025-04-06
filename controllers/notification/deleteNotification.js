const Notification = require('../../models/Notification')

// Delete notifications
const deleteNotification = async (req, res) => {
  try {
    const { notificationIds } = req.body
    const userId = req.user._id
    if (!userId || !notificationIds || !notificationIds.length) {
      return res.status(400).json({ error: 'Invalid request data.' })
    }

    await Notification.deleteMany({ userId, _id: { $in: notificationIds } })

    return res.status(200).json({
      success: true,
      message: 'Notifications deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = deleteNotification
