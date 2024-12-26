// Create a post
const Post = require('../../models/Post');

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required.",
            });
        }

        const newPost = new Post({
            title,
            content,
            user: req.user.userId, // Assign the post to the authenticated user
        });

        const savedPost = await newPost.save();

        res.status(201).json({
            success: true,
            message: "Post created successfully.",
            data: savedPost,
        });
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the post.",
            error: error.message,
        });
    }
};

module.exports = createPost;
