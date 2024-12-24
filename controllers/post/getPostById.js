// Get a post by id
const Post = require('../models/postModel');
const handleErrors = require('../utils/handleErrors');

/**
 * Controller to retrieve a post by its ID.
 */
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId); // Find post by ID

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    handleErrors(res, error, 'Failed to retrieve post');
  }
};

module.exports = getPostById;
