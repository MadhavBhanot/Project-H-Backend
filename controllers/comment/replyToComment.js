// Reply to a comment
const Comment = require('../../models/Comment')

async function replyToComment(req, res) {
    let comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ message: "Comment Not Found" })
    let replyData = {
        content: req.body.content,
        authorId: req.user.userId,
        postID: comment.postId,
        parentComment: comment._id,
    }
    const reply = await Comment.create(replyData);
    comment.replies.push(reply._id)
    await comment.save()
    return res.status(200).json({ message: "Comment Reply Added Successfully", reply })
}

module.exports = replyToComment;
