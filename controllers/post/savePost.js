const Post = require('../../models/Post')
const User = require('../../models/User')

const savePost = async (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).json({ message: 'Post Id is Required' })
  }
  const userId = req.userId

  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the post is already saved by the user
    if (user.savedPosts.includes(id)) {
      // Unsave the post
      user.savedPosts.pull(id)
      await user.save()
      return res.status(200).json({ message: 'Post unsaved successfully' })
    } else {
      // Save the post
      user.savedPosts.push(id)
      await user.save()
    }

    return res.status(200).json({ message: 'Post saved successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Error saving post' })
  }
}

module.exports = savePost
