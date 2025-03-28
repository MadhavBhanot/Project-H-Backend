const Post = require('../../models/Post')
const User = require('../../models/User')

const getPostByUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false })
    }

    if (user.isPrivateAccount && !user.followers.includes(req.user._id)) {
      return res.status(200).json({
        message: 'Cannot get posts for private users without following',
        success: false,
      })
    }

    const posts = await Post.find({ author: id })

    return res
      .status(200)
      .json({ message: 'Postsr retrieved successfully', success: true, posts })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = getPostByUser
