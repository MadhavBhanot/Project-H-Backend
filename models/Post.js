const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Post schema
const PostSchema = new Schema(
  {
    image: {
      type: String, // No 'required' constraint, optional field
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment', // Reference the Comment schema
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Post model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
