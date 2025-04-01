const mongoose = require('mongoose');

const PrivateChatSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    // Last message in the chat for preview
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      sentAt: Date,
    },
    // Status of the chat for each participant
    participantStatus: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      // Indicates if the user has muted notifications for this chat
      isMuted: {
        type: Boolean,
        default: false,
      },
      // Last time the user read messages in this chat
      lastRead: {
        type: Date,
        default: Date.now,
      },
      // Indicates if user has archived/hidden this chat
      isArchived: {
        type: Boolean,
        default: false,
      },
      // Indicates if user has blocked the other participant
      isBlocked: {
        type: Boolean,
        default: false,
      },
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure that a private chat has exactly two participants
PrivateChatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Private chat must have exactly two participants'));
  }

  // Ensure participantStatus has entries for both participants
  if (this.isNew || this.participantStatus.length !== 2) {
    const userStatusMap = {};
    this.participantStatus.forEach(status => {
      userStatusMap[status.user.toString()] = status;
    });

    this.participantStatus = this.participants.map(userId => {
      const existingStatus = userStatusMap[userId.toString()];
      if (existingStatus) {
        return existingStatus;
      }
      return {
        user: userId,
        isMuted: false,
        lastRead: new Date(),
        isArchived: false,
        isBlocked: false,
      };
    });
  }

  next();
});

// Helper method to check if a user is a participant in the chat
PrivateChatSchema.methods.isParticipant = function(userId) {
  return this.participants.some(id => id.toString() === userId.toString());
};

// Helper method to get the other participant in the chat
PrivateChatSchema.methods.getOtherParticipant = function(userId) {
  return this.participants.find(id => id.toString() !== userId.toString());
};

// Helper method to check if a user has blocked the other participant
PrivateChatSchema.methods.isBlocked = function(userId) {
  const status = this.participantStatus.find(
    status => status.user.toString() === userId.toString()
  );
  return status && status.isBlocked;
};

// Helper method to update a user's chat status
PrivateChatSchema.methods.updateStatus = async function(userId, updates) {
  const statusIndex = this.participantStatus.findIndex(
    status => status.user.toString() === userId.toString()
  );
  
  if (statusIndex !== -1) {
    Object.assign(this.participantStatus[statusIndex], updates);
    return this.save();
  }
};

// Indexes for efficient queries
PrivateChatSchema.index({ participants: 1 });
PrivateChatSchema.index({ 'participantStatus.user': 1 });
PrivateChatSchema.index({ 'participantStatus.isArchived': 1 });
PrivateChatSchema.index({ isActive: 1 });

module.exports = mongoose.model('PrivateChat', PrivateChatSchema); 