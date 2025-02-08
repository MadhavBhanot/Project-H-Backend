const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const User = require('../../models/User')

const getAllComment = async (req, res) => {
  // Check for post Id
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'Post Id is Required' })
  }

  try {
    // First get all comments for the post, but only top-level comments (no parentComment)
    const post = await Post.findById(id)
      .populate({
        path: 'comments',
        match: { parentComment: null }, // Only get top-level comments
        populate: [
          {
            path: 'authorId',
            model: 'User',
            select: 'username profileImg clerkId'
          }
        ]
      })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Get all comments including replies
    const allComments = await Comment.find({ postId: id })
      .populate({
        path: 'authorId',
        model: 'User',
        select: 'username profileImg clerkId'
      })

    // Create a map of parent comments to their replies
    const repliesMap = new Map()
    allComments.forEach(comment => {
      if (comment.parentComment) {
        if (!repliesMap.has(comment.parentComment.toString())) {
          repliesMap.set(comment.parentComment.toString(), [])
        }
        repliesMap.get(comment.parentComment.toString()).push(comment)
      }
    })

    // Transform comments to include author details and replies
    const transformedComments = post.comments.map(comment => {
      const commentReplies = repliesMap.get(comment._id.toString()) || []
      return {
        _id: comment._id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          _id: comment.authorId._id,
          username: comment.authorId.username,
          imageUrl: comment.authorId.profileImg
        },
        replies: commentReplies.map(reply => ({
          _id: reply._id,
          content: reply.content,
          createdAt: reply.createdAt,
          author: {
            _id: reply.authorId._id,
            username: reply.authorId.username,
            imageUrl: reply.authorId.profileImg
          }
        }))
      }
    })

    console.log('✨ Transformed comments:', JSON.stringify(transformedComments, null, 2))

    return res.status(200).json({
      message: 'Comments Fetched Successfully',
      comments: transformedComments
    })
  } catch (error) {
    console.error('❌ Error getting comments:', error)
    return res.status(500).json({ message: 'Error Getting Comments' })
  }
}

module.exports = getAllComment
