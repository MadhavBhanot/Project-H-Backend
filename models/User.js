// User Schema
const mongoose = require('mongoose')

const User = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
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
      // required: true,
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
      default: false,
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
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('User', User)
