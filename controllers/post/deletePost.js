const Post = require('../../models/Post')
const User = require('../../models/User')

const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body  // Get userId from request body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.',
      })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    // Convert both IDs to string for comparison
    const postAuthorId = post.author.toString()
    const requestUserId = userId.toString()

    if (postAuthorId !== requestUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post.',
      })
    }

    await Post.deleteOne({ _id: id })

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully.',
    })
  } catch (error) {
    console.error('Error in deletePost:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

module.exports = deletePost
