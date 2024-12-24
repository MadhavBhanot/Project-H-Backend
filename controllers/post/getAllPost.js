// Get all posts
const Post = require('../models/postModel');
const handleErrors = require('../utils/handleErrors');

/**
 * Controller to retrieve all posts.
 */
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts
    if (!posts.length) {
      return res.status(404).json({ success: false, message: 'No posts found' });
    }

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    handleErrors(res, error, 'Failed to retrieve posts');
  }
};

module.exports = getAllPosts;
