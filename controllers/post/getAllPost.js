const Post = require('../../models/Post') // Adjust the path as needed

// Controller to get all posts
const getPosts = async (req, res) => {
  try {
    // Retrieve all posts and populate user data
    const { type } = req.query
    const filter = {}
    if (type) {
      filter.type = type
    }
    // Fetch posts from the database
    const posts = await Post.find(filter).populate('user', 'username email')

    // Check if posts exist
    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No posts found',
      })
    }

    // Respond with the list of posts
    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: posts,
    })
  } catch (error) {
    console.error('Error in getPosts:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving posts',
      error: error.message,
    })
  }
}

module.exports = getPosts
