const Post = require('../../models/Post');
const User = require('../../models/User');

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params; // This will be MongoDB ID
    console.log('\n🔍 Debug: Fetching posts');
    console.log('👤 Requested MongoDB userId:', userId);

    // Find all posts in the database to debug
    const allPosts = await Post.find({});
    console.log('\n📊 All Posts in Database:', allPosts.length);
    allPosts.forEach((post, index) => {
      console.log(`\nPost ${index + 1}:`);
      console.log('ID:', post._id);
      console.log('Author:', post.author);
      console.log('Caption:', post.caption);
    });

    // Find posts by MongoDB ID
    const userPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 });

    console.log('\n🎯 Posts found for MongoDB user:', userPosts.length);
    console.log('Posts:', userPosts);

    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      posts: userPosts
    });
  } catch (error) {
    console.error('❌ Error in getUserPosts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user posts',
      error: error.message
    });
  }
};

module.exports = getUserPosts; 