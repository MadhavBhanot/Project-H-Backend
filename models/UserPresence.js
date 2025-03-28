const mongoose = require('mongoose');

const UserPresenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Current online status
    status: {
      type: String,
      enum: ['online', 'away', 'offline', 'busy', 'invisible'],
      default: 'offline',
    },
    // User's custom status message
    statusMessage: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    // Last active timestamp
    lastActive: {
      type: Date,
      default: Date.now,
    },
    // Socket ID for current connection
    socketId: {
      type: String,
    },
    // Current device information
    device: {
      type: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet', 'unknown'],
        default: 'unknown',
      },
      os: String,
      browser: String,
      appVersion: String,
    },
    // Typing status tracking
    typing: [{
      inChat: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'typingChatModel',
      },
      typingChatModel: {
        type: String,
        enum: ['PrivateChat', 'ChatGroup'],
      },
      since: {
        type: Date,
        default: Date.now,
      },
    }],
    // Privacy settings
    privacySettings: {
      showLastSeen: {
        type: Boolean,
        default: true,
      },
      showOnlineStatus: {
        type: Boolean,
        default: true,
      },
      showTypingIndicator: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

// Method to update user's online status
UserPresenceSchema.methods.updateStatus = async function(newStatus, socketId = null) {
  this.status = newStatus;
  this.lastActive = new Date();
  
  if (socketId) {
    this.socketId = socketId;
  }
  
  return this.save();
};

// Method to mark a user as offline
UserPresenceSchema.methods.goOffline = async function() {
  this.status = 'offline';
  this.lastActive = new Date();
  this.socketId = null;
  this.typing = []; // Clear any typing indicators
  
  return this.save();
};

// Method to add typing indicator
UserPresenceSchema.methods.startTyping = async function(chatId, chatModel) {
  // Remove any existing typing indicator for this chat
  this.typing = this.typing.filter(t => 
    !(t.inChat.toString() === chatId.toString() && t.typingChatModel === chatModel)
  );
  
  // Add new typing indicator
  this.typing.push({
    inChat: chatId,
    typingChatModel: chatModel,
    since: new Date()
  });
  
  return this.save();
};

// Method to remove typing indicator
UserPresenceSchema.methods.stopTyping = async function(chatId, chatModel) {
  this.typing = this.typing.filter(t => 
    !(t.inChat.toString() === chatId.toString() && t.typingChatModel === chatModel)
  );
  
  return this.save();
};

// Method to update privacy settings
UserPresenceSchema.methods.updatePrivacySettings = async function(settings) {
  Object.assign(this.privacySettings, settings);
  return this.save();
};

// Static method to find online users from a list of user IDs
UserPresenceSchema.statics.findOnlineUsers = async function(userIds) {
  return this.find({
    user: { $in: userIds },
    status: { $ne: 'offline' },
    'privacySettings.showOnlineStatus': true
  }).select('user status lastActive');
};

// Create TTL index to clean up typing indicators after 1 minute
UserPresenceSchema.index({ 'typing.since': 1 }, { expireAfterSeconds: 60 });

// Indexes for efficient queries
UserPresenceSchema.index({ user: 1 });
UserPresenceSchema.index({ status: 1 });
UserPresenceSchema.index({ lastActive: 1 });
UserPresenceSchema.index({ 'typing.inChat': 1 });

module.exports = mongoose.model('UserPresence', UserPresenceSchema); 