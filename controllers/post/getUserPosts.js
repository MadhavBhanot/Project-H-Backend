const Post = require('../../models/Post');
const User = require('../../models/User');
const mongoose = require('mongoose');

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.query;
    console.log('🔍 Fetching posts request with params:', { userId, email });

    // First try to find user by MongoDB ID (userId parameter)
    let user = null;
    
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      console.log('🔍 Looking up user by MongoDB ID:', userId);
      user = await User.findById(userId);
      if (user) {
        console.log('✅ Found user by MongoDB ID:', {
          _id: user._id.toString(),
          username: user.username,
          clerkId: user.clerkId
        });
      } else {
        console.log('❌ User not found by MongoDB ID:', userId);
      }
    }
    
    // If not found by ID and email is provided, try to find by email
    if (!user && email) {
      console.log('🔍 Looking up user by email:', email);
      user = await User.findOne({ email });
      if (user) {
        console.log('✅ Found user by email:', {
          _id: user._id.toString(),
          username: user.username,
          email: user.email
        });
      } else {
        console.log('❌ User not found by email:', email);
      }
    }
    
    // If still not found, look for a user by Clerk ID
    if (!user && userId && !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('🔍 Looking up user by Clerk ID:', userId);
      user = await User.findOne({ clerkId: userId });
      if (user) {
        console.log('✅ Found user by Clerk ID:', {
          _id: user._id.toString(),
          username: user.username,
          clerkId: user.clerkId
        });
      } else {
        console.log('❌ User not found by Clerk ID:', userId);
      }
    }
    
    // As a last resort, try to use the authenticated user from the request
    if (!user && req.user) {
      console.log('🔍 Using authenticated user from request');
      user = req.user;
      console.log('✅ Using authenticated user:', {
        _id: user._id.toString(),
        username: user.username
      });
    }
    
    // If no user found by any method, return error
    if (!user) {
      console.log('❌ User not found by any lookup method');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log user details one more time to ensure we're fetching for the right user
    console.log('👤 Fetching posts for user:', {
      _id: user._id.toString(),
      username: user.username,
      clerkId: user.clerkId,
      email: user.email
    });

    // Find all posts by this exact user
    const posts = await Post.find({ author: user._id })
      .populate({
        path: 'author',
        select: '_id username profileImg'
      })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${posts.length} posts for user:`, user._id);
    
    // Double-check that all posts belong to this user
    const validPosts = posts.filter(post => {
      if (!post.author || !post.author._id) {
        console.warn('⚠️ Post has no author:', post._id);
        return false;
      }
      
      const postAuthorId = post.author._id.toString();
      const requestedUserId = user._id.toString();
      
      if (postAuthorId !== requestedUserId) {
        console.error('🚨 Post author mismatch:', {
          postId: post._id.toString(),
          postAuthorId,
          requestedUserId
        });
        return false;
      }
      
      return true;
    });
    
    if (validPosts.length !== posts.length) {
      console.warn(`⚠️ Filtered out ${posts.length - validPosts.length} posts with incorrect author`);
    }

    // Return empty array if no posts found
    if (!validPosts || validPosts.length === 0) {
      console.log('ℹ️ No valid posts found for user:', user._id);
      return res.status(200).json({
        success: true,
        message: 'No posts found',
        posts: []
      });
    }

    // Transform posts to include author details
    const transformedPosts = validPosts.map(post => ({
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

    console.log(`✅ Returning ${transformedPosts.length} posts for user:`, user._id);

    return res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      posts: transformedPosts,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
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