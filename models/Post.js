// Post Schema
const mongoose = require('mongoose')

const Post = new mongoose.Schema(
    {
        image: {
            type: String,
        },
        caption: {
            type: String,
            required: true,
        },
        comments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Comment',
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Post', Post)