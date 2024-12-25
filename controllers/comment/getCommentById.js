// Get Comment By Id
const Comment = require('../../models/Comment')

async function getCommentById(req, res) {
    const data = await Comment.findById(req.params.id)
    if (!data) return res.status(404).json({ message: "Comment Not Found", data })
    return res.status(200).json({ message: "Comment Retrieved Successfully", data })
}

module.exports = getCommentById;