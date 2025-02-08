const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    image: {
      type: String, // No 'required' constraint, optional field
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []  // Initialize as empty array
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
      default: [],
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
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Post', PostSchema)
