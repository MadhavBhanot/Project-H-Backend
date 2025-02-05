const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const User = require('../../models/User')

const getComments = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'Post Id is Required' })
  }

  try {
    // First, get all comments for this post
    const comments = await Comment.find({ postId: id })
      .populate({
        path: 'authorId',
        select: '_id username profileImg clerkId'
      })
      .sort({ createdAt: -1 });

    // Process comments to include author details and structure replies
    const processedComments = comments.map(comment => ({
      _id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      parentComment: comment.parentComment,
      author: {
        _id: comment.authorId._id,
        username: comment.authorId.username,
        imageUrl: comment.authorId.profileImg || '',
        profileImg: comment.authorId.profileImg || ''
      }
    }));

    // Create a map for quick lookup and organize into parent-child structure
    const commentMap = new Map();
    const topLevelComments = [];

    // First pass: Create map of all comments
    processedComments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment._id.toString(), comment);
    });

    // Second pass: Organize into hierarchy
    processedComments.forEach(comment => {
      if (comment.parentComment) {
        // This is a reply
        const parentComment = commentMap.get(comment.parentComment.toString());
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      } else {
        // This is a top-level comment
        topLevelComments.push(comment);
      }
    });

    console.log('Sending comments:', topLevelComments);

    return res.status(200).json({
      message: 'Comments Fetched Successfully',
      comments: topLevelComments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Error fetching comments' });
  }
};

module.exports = getComments; 