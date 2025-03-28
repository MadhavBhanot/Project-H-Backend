const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    bio: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      type: [String], // Array of Strings
      enum: [
        'Technology',
        'Programming & Development',
        'Data Science & AI',
        'Mathematics & Logic',
        'Engineering',
        'Science & Research',
        'Entrepreneurship & Business',
        'Finance & Investing',
        'Career & Personal Development',
        'Health & Wellness',
        'Books & Literature',
        'Psychology & Mindset',
        'Art & Creativity',
        'History & Philosophy',
        'News & Current Affairs',
        'Entertainment & Media',
      ],
      default: [],
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    postedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    isPrivateAccount: {
      type: Boolean,
      default: false, // Whether the user's account is private
    },
    interests: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resume: {
      type: String,
      default: null,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }, // Automatically adds createdAt & updatedAt fields
)

module.exports = mongoose.model('User', UserSchema)
