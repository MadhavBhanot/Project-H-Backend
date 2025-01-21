const Post = require('../../models/Post')
const User = require('../../models/User')

const getAllLikesForPost = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: 'Post ID is required.' })
  }

  try {
    // Find the post and populate the 'likes' field with user data
    const post = await Post.findById(id).populate('likes', 'username email')

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' })
    }

    // Return the populated 'likes' field
    return res.status(200).json({
      message: 'Likes fetched successfully.',
      likes: post.likes, // Array of users who liked the post
      likeCount: post.likes.length,
    })
  } catch (error) {
    console.error('Error fetching likes for post:', error)
    return res.status(500).json({
      message: 'Error fetching likes for post.',
      error: error.message,
    })
  }
}

module.exports = getAllLikesForPost
