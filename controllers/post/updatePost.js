// Update a post
const Post = require('../../models/Post');

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required.",
            });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found.",
            });
        }

        // Check if the post belongs to the authenticated user
        if (post.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this post.",
            });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        const updatedPost = await post.save();

        res.status(200).json({
            success: true,
            message: "Post updated successfully.",
            data: updatedPost,
        });
    } catch (error) {
        console.error('Error in updatePost:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the post.",
            error: error.message,
        });
    }
};

module.exports = updatePost;
