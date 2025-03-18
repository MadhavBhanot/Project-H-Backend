const Post = require('../../models/Post')
const User = require('../../models/User')

const likeOrUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.user._id

    // Find the post
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user has already liked the post
    const isLiked = post.likes.includes(userId)

    // If user has liked, remove their ID (unlike)
    // If user hasn't liked, add their ID (like)
    const updateOperation = isLiked 
      ? { $pull: { likes: userId } }  // Remove user ID from likes
      : { $addToSet: { likes: userId } }  // Add user ID to likes

    console.log(isLiked ? '👎 Unliking post' : '👍 Liking post')

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateOperation,
      { new: true }
    )

    // Return the new state
    return res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      liked: !isLiked,
      likesCount: updatedPost.likes.length,
      userId: userId.toString()
    })

  } catch (error) {
    console.error('Error in liking/unliking post:', error)
    return res.status(500).json({
      success: false,
      message: 'Error processing like/unlike'
    })
  }
}

module.exports = likeOrUnlikePost
