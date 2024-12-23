const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Post schema
const PostSchema = new Schema(
  {
    image: {
      type: String,
      required: true, // Image URL is required
    },
    caption: {
      type: String,
      required: true, // Caption is required
      trim: true, // Removes extra spaces
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User', // References the User schema
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User', // References the User schema
        },
        text: {
          type: String,
          required: true, // Comment text is required
        },
        createdAt: {
          type: Date,
          default: Date.now, // Timestamp for when the comment was created
        },
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // References the User schema
      required: true,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

// Create the Post model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
