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
    tags: [{
      type: String,
    }],
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Post', PostSchema)
