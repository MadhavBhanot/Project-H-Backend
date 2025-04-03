const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who triggered the notification
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }, // User who receives the notification
  type: {
    type: String,
    required: true,
    enum: ['like', 'comment', 'follow-request', 'job', 'message'],
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: Object, default: {} }, // Store postId, messageId, etc.
  isRead: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }, // Soft delete
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Notification', NotificationSchema)
