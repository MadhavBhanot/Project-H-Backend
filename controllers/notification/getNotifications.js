const Notification = require('../../models/Notification')

const getNotification = async (req, res) => {
  try {
    const userId = req.user._id
    const { unread } = req.query

    const filter = { userId }
    if (unread === 'true') {
      filter.isRead = false
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 }) // Latest notifications first
      .lean()

    return res.status(200).json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = getNotification
