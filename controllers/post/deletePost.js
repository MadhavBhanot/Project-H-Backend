// Delete a post
const Post = require('../../models/Post');
const User = require('../../models/User');

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

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
        const user = await User.findById(post.author); 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Author not found.",
            });
        }
        if (user.clerkId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post.",
            });
        }

        await post.remove();

        res.status(200).json({
            success: true,
            message: "Post deleted successfully.",
        });
    } catch (error) {
        console.error('Error in deletePost:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the post.",
            error: error.message,
        });
    }
};

module.exports = deletePost;
