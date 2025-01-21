const Post = require('../../models/Post')
const User = require('../../models/User')

const deletePost = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required.',
      })
    }

    // Find the post by ID
    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    // Find the user who created the post
    const user = await User.findById(post.author)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Author not found.',
      })
    }

    // Check if the authenticated user is the owner of the post
    if (req.userId.toString() !== post.author.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post.',
      })
    }

    // Delete the post
    await Post.deleteOne({ _id: id })

    // Remove the post from the user's `posts` array
    user.posts = user.posts.filter((postId) => postId.toString() !== id)
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully.',
      post,
    })
  } catch (error) {
    console.error('Error in deletePost:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the post.',
      error: error.message,
    })
  }
}

module.exports = deletePost
