const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const User = require('../../models/User')

const addComment = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'Post Id is Required' })
  }
  const { content, parentComment } = req.body

  if (!content) {
    return res.status(400).json({ message: 'Content is Required' })
  }

  try {
    // Find the post
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post Not Found' })
    }

    // Get the user
    const user = await User.findOne({ clerkId: req.userId })
      .select('_id username profileImg clerkId')
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' })
    }

    // If this is a reply, verify parent comment exists
    let parentCommentDoc = null;
    if (parentComment) {
      parentCommentDoc = await Comment.findById(parentComment)
        .populate({
          path: 'authorId',
          select: '_id username profileImg clerkId'
        });
      
      if (!parentCommentDoc) {
        return res.status(404).json({ message: 'Parent Comment Not Found' });
      }
    }

    // Create the new comment
    const newComment = new Comment({
      content,
      authorId: user._id,
      postId: id,
      parentComment: parentComment || null
    });

    await newComment.save();

    // If this is a reply, add it to parent comment's replies array
    if (parentComment && parentCommentDoc) {
      parentCommentDoc.replies = parentCommentDoc.replies || [];
      parentCommentDoc.replies.push(newComment._id);
      await parentCommentDoc.save();
    }

    // Add to post's comments array only if it's a top-level comment
    if (!parentComment) {
      post.comments.push(newComment._id);
      await post.save();
    }

    // Create the response object with all necessary fields
    const commentResponse = {
      _id: newComment._id.toString(),
      content: newComment.content,
      createdAt: newComment.createdAt,
      postId: newComment.postId.toString(),
      parentComment: parentComment ? parentComment.toString() : null,
      replies: [],
      author: {
        _id: user._id.toString(),
        username: user.username,
        imageUrl: user.profileImg || '',
        profileImg: user.profileImg || ''
      }
    };

    console.log('✅ Comment/reply added:', commentResponse);

    return res.status(200).json({
      success: true,
      message: parentComment ? 'Reply Added Successfully' : 'Comment Added Successfully',
      comment: commentResponse
    });

  } catch (error) {
    console.error('❌ Error creating comment/reply:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error creating comment/reply'
    });
  }
};

module.exports = addComment;
