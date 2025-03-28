const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Only required for private messages
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatGroup',
      // Only required for group messages
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    chatType: {
      type: String,
      enum: ['private', 'group'],
      required: true,
    },
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      readAt: {
        type: Date,
        default: Date.now,
      }
    }],
    attachments: [{
      type: {
        type: String,
        enum: ['image', 'file', 'audio', 'video'],
      },
      url: String,
      name: String,
      size: Number,
    }],
    // For quick access to all participants in any chat
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

// Add validation to ensure either recipient or group is set based on chatType
MessageSchema.pre('validate', function(next) {
  if (this.chatType === 'private' && !this.recipient) {
    return next(new Error('Recipient is required for private messages'));
  }
  if (this.chatType === 'group' && !this.group) {
    return next(new Error('Group is required for group messages'));
  }
  next();
});

// Automatically set participants based on chatType
MessageSchema.pre('save', function(next) {
  // For private messages, participants are sender and recipient
  if (this.chatType === 'private') {
    this.participants = [this.sender, this.recipient];
  }
  // For group messages, participants will be managed by the ChatGroup model
  
  next();
});

// Add indexes for efficient queries
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ group: 1 });
MessageSchema.index({ participants: 1 });
MessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema); 