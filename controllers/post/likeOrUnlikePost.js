const Post = require('../../models/Post')
const User = require('../../models/User')

const likeOrUnlikePost = async (req, res) => {
  console.log('Hit')
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

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID is required.',
      })
    }

    // Find the user by ID
    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    // Check if the user already liked the post
    const hasLiked = post.likes.includes(user._id)

    if (hasLiked) {
      // Unlike the post
      post.likes = post.likes.filter(
        (like) => like.toString() !== user._id.toString(),
      )
      user.likedPosts = user.likedPosts.filter(
        (postId) => postId.toString() !== id.toString(),
      )

      await user.save()
      await post.save()

      return res.status(200).json({
        success: true,
        message: 'Post unliked successfully.',
      })
    } else {
      // Like the post
      post.likes.push(user._id)
      user.likedPosts.push(id)

      await user.save()
      await post.save()

      return res.status(200).json({
        success: true,
        message: 'Post liked successfully.',
      })
    }
  } catch (error) {
    console.error('Error in liking or unliking the post:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while liking or unliking the post.',
      error: error.message,
    })
  }
}

module.exports = likeOrUnlikePost
