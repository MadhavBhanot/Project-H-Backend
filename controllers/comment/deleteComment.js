// Delete a comment
const Comment = require('../../models/Comment')
const User = require('../../models/User')

async function deleteComment(req, res) {
    const comment = await Comment.findById(req.params.id)
    if (!req.user.userId.equals(comment.authorId)) return res.status(400).json({ message: "Not Authorized To Delete the Comment" })
    if (!comment) return res.status(400).json({ message: "Comment Not Found" })
    await Comment.deleteOne(comment)
    return res.status(200).json({ message: "Comment Deleted Successfully" })
}

module.exports = deleteComment;