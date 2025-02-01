// User Schema
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      // Not required initially, will be added after verification
      required: false,
      unique: true,
      sparse: true // This allows null values while maintaining uniqueness
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    // phoneNumber: {
    //   type: String,
    //   required: false,
    //   default: null
    // },
    profileImg: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    preferences: {
      type: Array,
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
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Job',
      },
    ],

    isPrivateAccount: {
      type: Boolean,
      default: false, // Whether the user's account is private
    },
    verificationCode: {
      type: String,
      default: null
    },
    verificationCodeExpires: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('User', userSchema)
