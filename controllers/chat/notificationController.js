const User = require('../../models/User');
const ChatNotification = require('../../models/ChatNotification');

/**
 * Get notifications for current user
 */
const getNotifications = async (req, res) => {
  try {
    console.log('🔔 Getting user notifications');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Get MongoDB user
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('❌ User not found for MongoDB ID:', req.userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const mongoUserId = user._id;
    
    // Get notifications with pagination
    const notifications = await ChatNotification.find({
      recipient: mongoUserId
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', '_id username profileImg');
    
    // Count total notifications for pagination
    const totalNotifications = await ChatNotification.countDocuments({
      recipient: mongoUserId
    });
    
    // Count unread notifications
    const unreadCount = await ChatNotification.countDocuments({
      recipient: mongoUserId,
      isRead: false
    });
    
    // Format notifications for response
    const formattedNotifications = notifications.map(notification => ({
      _id: notification._id,
      type: notification.type,
      sender: notification.sender ? {
        _id: notification.sender._id,
        username: notification.sender.username,
        profileImg: notification.sender.profileImg
      } : null,
      content: notification.content,
      chat: notification.chat,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt
    }));
    
    console.log(`✅ Found ${notifications.length} notifications`);
    return res.status(200).json({
      success: true,
      data: {
        notifications: formattedNotifications,
        unreadCount,
        pagination: {
          total: totalNotifications,
          page,
          limit,
          pages: Math.ceil(totalNotifications / limit)
        }
      }
    });
  } catch (error) {
    console.error('❌ Error getting notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting notifications',
      error: error.message
    });
  }
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (req, res) => {
  try {
    console.log('🔔 Marking notification as read');
    const { notificationId } = req.params;
    
    // Get MongoDB user
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('❌ User not found for MongoDB ID:', req.userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const mongoUserId = user._id;
    
    // Find the notification
    const notification = await ChatNotification.findOne({
      _id: notificationId,
      recipient: mongoUserId
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Mark as read
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
    
    console.log('✅ Notification marked as read');
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: {
        _id: notification._id,
        isRead: notification.isRead,
        readAt: notification.readAt
      }
    });
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    console.log('🔔 Marking all notifications as read');
    
    // Get MongoDB user
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('❌ User not found for MongoDB ID:', req.userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const mongoUserId = user._id;
    
    // Update all unread notifications
    const updateResult = await ChatNotification.updateMany(
      {
        recipient: mongoUserId,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );
    
    console.log(`✅ Marked ${updateResult.modifiedCount} notifications as read`);
    return res.status(200).json({
      success: true,
      message: `Marked ${updateResult.modifiedCount} notifications as read`,
      data: {
        count: updateResult.modifiedCount
      }
    });
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (req, res) => {
  try {
    console.log('🔔 Deleting notification');
    const { notificationId } = req.params;
    
    // Get MongoDB user
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('❌ User not found for MongoDB ID:', req.userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const mongoUserId = user._id;
    
    // Find and delete the notification
    const notification = await ChatNotification.findOneAndDelete({
      _id: notificationId,
      recipient: mongoUserId
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    console.log('✅ Notification deleted');
    return res.status(200).json({
      success: true,
      message: 'Notification deleted',
      data: {
        _id: notification._id
      }
    });
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

/**
 * Delete all notifications
 */
const deleteAllNotifications = async (req, res) => {
  try {
    console.log('🔔 Deleting all notifications');
    
    // Get MongoDB user
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('❌ User not found for MongoDB ID:', req.userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const mongoUserId = user._id;
    
    // Delete all notifications for this user
    const deleteResult = await ChatNotification.deleteMany({
      recipient: mongoUserId
    });
    
    console.log(`✅ Deleted ${deleteResult.deletedCount} notifications`);
    return res.status(200).json({
      success: true,
      message: `Deleted ${deleteResult.deletedCount} notifications`,
      data: {
        count: deleteResult.deletedCount
      }
    });
  } catch (error) {
    console.error('❌ Error deleting all notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting all notifications',
      error: error.message
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
}; 