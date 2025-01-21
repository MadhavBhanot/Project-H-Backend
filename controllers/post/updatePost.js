// Update a post
const Post = require('../../models/Post')
const User = require('../../models/User')

const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { image, caption, category } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required.',
      })
    }

    if (!image && !caption && !category) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' })
    }

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

    // Check if the post belongs to the authenticated user
    if (post.author.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post.',
      })
    }

    post.caption = caption || post.caption
    post.image = image || post.image
    post.category = category || post.category

    const updatedPost = await post.save()

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      data: updatedPost,
    })
  } catch (error) {
    console.error('Error in updatePost:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the post.',
      error: error.message,
    })
  }
}

module.exports = updatePost
