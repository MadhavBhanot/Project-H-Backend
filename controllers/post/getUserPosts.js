const Post = require('../../models/Post');
const User = require('../../models/User');

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔍 Fetching posts for user:', userId);

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find all posts by this user
    const posts = await Post.find({ author: userId })
      .populate({
        path: 'author',
        select: '_id username profileImg'
      })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${posts.length} posts for user:`, userId);

    // Return empty array if no posts found
    if (!posts || posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No posts found',
        posts: []
      });
    }

    // Transform posts to include author details
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      likes: post.likes || [],
      comments: post.comments || [],
      author: post.author ? {
        _id: post.author._id,
        username: post.author.username,
        imageUrl: post.author.profileImg || ''
      } : null
    }));

    return res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      posts: transformedPosts
    });

  } catch (error) {
    console.error('❌ Error in getUserPosts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user posts',
      error: error.message
    });
  }
};

module.exports = getUserPosts; 