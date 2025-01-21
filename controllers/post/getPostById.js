const Post = require('../../models/Post') // Adjust the path as needed

// Controller to get a post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      })
    }

    // Find the post by ID and populate user data
    const post = await Post.findById(id)
      .populate({
        path: 'author',
        select: 'username', // Select only the username field of the author
      })
      .select('author') // Select only the author field of the post

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    // Respond with the post data
    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: post,
    })
  } catch (error) {
    console.error('Error in getPostById:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the post',
      error: error.message,
    })
  }
}

module.exports = getPostById
