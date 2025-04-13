const Post = require('../../models/Post')

const updateView = async (req, res) => {
  const { id } = req.params
  try {
    const post = await Post.findOneById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false })
    }

    if (post.viewedBy.includes(req.user._id)) {
      return res.status(200).json({ message: 'Already viewed', success: true })
    }

    post.viewedBy.push(req.user._id)
    await post.save()
    return res
      .status(200)
      .json({ message: 'Views updated', success: true, post })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = updateView
