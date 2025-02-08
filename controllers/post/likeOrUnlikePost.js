const Post = require('../../models/Post')
const User = require('../../models/User')

const likeOrUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.user._id // Get MongoDB user ID directly from req.user

    console.log('👍 Like/Unlike request:', { postId, userId })

    // Find the post and ensure likes array exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Ensure likes array exists
    if (!Array.isArray(post.likes)) {
      post.likes = []
      await Post.updateOne({ _id: postId }, { $set: { likes: [] } })
    }

    // Convert user._id to string for comparison
    const userIdStr = userId.toString()
    const hasLiked = post.likes.some(id => id.toString() === userIdStr)

    if (hasLiked) {
      // Unlike: Remove user's ID from likes array
      post.likes = post.likes.filter(id => id.toString() !== userIdStr)
      console.log('👎 User unliked post')
    } else {
      // Like: Add user's ID to likes array
      post.likes.push(userId)
      console.log('👍 User liked post')
    }

    // Save the updated post
    await post.save()

    // Return updated post data
    res.status(200).json({
      success: true,
      message: hasLiked ? 'Post unliked successfully' : 'Post liked successfully',
      liked: !hasLiked,
      likesCount: post.likes.length,
      userId: userIdStr // Include the user's MongoDB ID in the response
    })

  } catch (error) {
    console.error('Error in liking or unliking the post:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while liking or unliking the post.',
      error: error.message
    })
  }
}

module.exports = likeOrUnlikePost
