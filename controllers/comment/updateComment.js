// Update a comment
const Comment = require('../../models/Comment')

async function updateComment(req, res) {
    const comment = await Comment.findById(req.params.id)
    if (!req.user.userId.equals(comment.authorId)) return res.status(400).json({ message: "Not Authorized To Update the Comment" })
    if (!comment) return res.status(400).json({ message: "Comment Not Found" })
    await updateCommentHelper(comment, req.body)
    return res.status(200).json({ message: "Comment Updated Successfully" })
}

async function updateCommentHelper(comment, data) {
    await comment.updateOne(data)
    await comment.save()
}

module.exports = updateComment;