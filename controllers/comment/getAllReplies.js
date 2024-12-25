// Get All Replies for a comment
const Comment = require('../../models/Comment')

async function getRepliesForComment(req, res) {
    const data = await Comment.findById(req.params.id)
    if (!data) return res.status(404).json({ message: "Comment Not Found", data })
    return res.status(200).json({ message: "Comment Replies Retrieved Successfully", data: data.replies })
}

module.exports = getRepliesForComment;