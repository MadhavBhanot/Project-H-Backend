const Post = require('../../models/Post')

const getAllComment = async (req, res) => {
  // Check for post Id
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'Post Id is Required' })
  }

  // Find all comments for the post
  try {
    const post = await Post.findById(id).populate('comments')
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    return res.status(200).json({
      message: 'Comments Fetched Successfully',
      comments: post.comments,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error Getting Comments' })
  }
}

module.exports = getAllComment
