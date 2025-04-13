const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['post', 'reel'],
      default: 'post',
      required: true,
    },
    image: [
      {
        type: String, // No 'required' constraint, optional field
      },
    ],
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [], // Initialize as empty array
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Reference the Comment Schema
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filters: {
      type: String,
    },
    category: {
      type: String,
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
      default: 'Technology',
      required: true,
      set: function (v) {
        // Handle array input
        if (Array.isArray(v)) {
          return v.length > 0 ? v[0].toString() : 'Technology'
        }
        // Handle string input
        return v ? v.toString() : 'Technology'
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    viewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Post', PostSchema)
