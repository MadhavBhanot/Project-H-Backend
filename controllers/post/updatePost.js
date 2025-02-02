// Update a post
const Post = require('../../models/Post')
const User = require('../../models/User')

const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { content, location } = req.body
    const userId = req.userId // From Clerk middleware

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    if (post.author.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.',
      })
    }

    if (content) post.content = content
    if (location) post.location = location

    await post.save()

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      post
    })
  } catch (error) {
    console.error('Error in updatePost:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

module.exports = updatePost
