const Post = require('../../models/Post')

const addComment = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'Post Id is Required' })
  }
  const { content } = req.body

  if (!content) {
    return res.status(400).json({ message: 'Content is Required' })
  }

  try {
    const post = Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: 'Post Not Found' })
    }
    const comment = new Comment({
      content,
      authorId: req.user.userId,
      postID: id,
    })

    await comment.save()

    post.comments.push(comment._id)
    await post.save()
    return res
      .status(200)
      .json({ message: 'Comment Added Successfully', comment })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating comment' })
  }
}

module.exports = addComment
