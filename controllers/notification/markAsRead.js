const Notification = require('../../models/Notification')
const mongoose = require('mongoose')

// Mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body
    
    // Get the user ID from the request
    // First check if it came from auth middleware
    let userId = req.user?._id
    
    // If not available from middleware, check query parameters
    if (!userId && req.query.mongoUserId) {
      if (mongoose.Types.ObjectId.isValid(req.query.mongoUserId)) {
        userId = req.query.mongoUserId
        console.log('🔍 Using mongoUserId from query:', userId)
      } else {
        console.log('❌ Invalid mongoUserId in query')
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID provided'
        })
      }
    }
    
    // Validate required data
    if (!userId || !notificationIds || !notificationIds.length) {
      console.log('❌ Missing required data for marking notifications')
      return res.status(400).json({ 
        success: false,
        message: 'Invalid request data.'
      })
    }

    console.log('📝 Marking notifications as read:', notificationIds)
    
    // Update using receiverId field (not userId which is the sender)
    await Notification.updateMany(
      { receiverId: userId, _id: { $in: notificationIds } },
      { isRead: true },
    )

    console.log('✅ Notifications marked as read')
    
    return res.status(200).json({
      success: true,
      message: 'Notifications marked as read',
    })
  } catch (error) {
    console.error('❌ Error marking notifications:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    })
  }
}

module.exports = markAsRead
