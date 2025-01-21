const Post = require('../../models/Post')
const User = require('../../models/User')

const getPostByUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ Status: 0, Message: 'User not found' })
    }

    const posts = await Post.find({ author: id })
    return res.status(200).json({ Status: 1, posts })
  } catch (error) {
    return res
      .status(500)
      .json({ Status: 0, Message: 'Internal Server Error', error })
  }
}

module.exports = getPostByUser
