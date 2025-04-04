const Post = require('../../models/Post')
const User = require('../../models/User')

/**
 * Get Home Feed for a user (Following-based)
 */
const getHomeFeed = async (req, res) => {
  try {

    const { id: userId } = req.params // Get userId from request params
    console.log('🔍 Feed requested for MongoDB user ID:', userId);

    // Verify MongoDB ID format first
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('❌ Invalid MongoDB user ID format:', userId);
      return res.status(400).json({ 
        error: 'Invalid user ID format',
        details: 'The provided ID does not appear to be a valid MongoDB ObjectId'
      });
    }

    const { id: userId } = req.params
    const { page = 1, limit = 20 } = req.query
    const pageLimit = parseInt(limit)
    const skip = (parseInt(page) - 1) * pageLimit


    const user = await User.findById(userId).lean()
    if (!user) {
      console.error('❌ User not found with MongoDB ID:', userId);
      return res.status(404).json({ 
        error: 'User not found',
        details: 'No user exists with the provided MongoDB ID'
      });
    }

    console.log('✅ Found user for feed:', {
      mongoId: user._id,
      username: user.username,
      clerkId: user.clerkId
    });

    const { following, preferences, likedPosts } = user
    const limit = parseInt(req.query.limit) || 20 // Allow limit as query param

    console.log('📊 User metrics:', {
      followingCount: following?.length || 0,
      preferencesCount: preferences?.length || 0,
      likedPostsCount: likedPosts?.length || 0
    });

    // For new users without much data, we'll need to show trending/recommended content
    const isNewUser = (!following || following.length === 0) && 
                      (!likedPosts || likedPosts.length === 0);
    
    if (isNewUser) {
      console.log('ℹ️ New user detected - showing trending content only');
    }

    // Create arrays to store our different post types
    let preferredPosts = [];
    let followingPosts = [];
    let trendingPosts = [];
    let tagMatchedPosts = [];

    // Fetch posts based on user preferences if they have any
    if (preferences && preferences.length > 0) {
      preferredPosts = await Post.find({ category: { $in: preferences } })
        .populate('author', 'username profileImg')
        .populate('comments')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      console.log(`✅ Found ${preferredPosts.length} posts matching user preferences`);
    }

    // Fetch posts from followed users if they follow anyone
    if (following && following.length > 0) {
      followingPosts = await Post.find({ author: { $in: following } })
        .populate('author', 'username profileImg')
        .populate('comments')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      console.log(`✅ Found ${followingPosts.length} posts from followed users`);
    }

    // Fetch trending posts - always do this as fallback content
    trendingPosts = await Post.find({})
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ likes: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    console.log(`✅ Found ${trendingPosts.length} trending posts`);

    // Fetch posts with tags matching liked posts if they've liked posts
    let likedTags = new Set();
    if (likedPosts && likedPosts.length > 0) {
      const likedPostData = await Post.find({ _id: { $in: likedPosts } }).lean();
      likedPostData.forEach((post) => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag) => likedTags.add(tag));
        }
      });
      
      if (likedTags.size > 0) {
        tagMatchedPosts = await Post.find({
          tags: { $in: Array.from(likedTags) },
        })
          .populate('author', 'username profileImg')
          .populate('comments')
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
        console.log(`✅ Found ${tagMatchedPosts.length} posts with matching tags`);
      }
    }

    // Merge all posts and remove duplicates
    let allPosts = [
      ...preferredPosts,
      ...followingPosts,
      ...trendingPosts,
      ...tagMatchedPosts,
    ];
    
    console.log('📊 Post collection sizes:', {
      preferredPosts: preferredPosts.length,
      followingPosts: followingPosts.length,
      trendingPosts: trendingPosts.length,
      tagMatchedPosts: tagMatchedPosts.length,
      total: allPosts.length
    });

    // Remove duplicates efficiently
    let uniquePosts = new Map();
    allPosts.forEach((post) => uniquePosts.set(post._id.toString(), post));
    console.log(`✅ After removing duplicates: ${uniquePosts.size} unique posts`);

    // Sort posts based on engagement & recency
    let sortedPosts = Array.from(uniquePosts.values()).sort((a, b) => {
      const aScore =
        (a.likes?.length || 0) * 3 +
        (a.comments?.length || 0) * 2 +
        (Date.now() - new Date(a.createdAt).getTime()) / 100000;
      const bScore =
        (b.likes?.length || 0) * 3 +
        (b.comments?.length || 0) * 2 +
        (Date.now() - new Date(b.createdAt).getTime()) / 100000;
      return bScore - aScore;
    });

    // Avoid consecutive posts from the same author
    let finalFeed = [];
    let authorLastPost = new Map();
    
    // For new users, prioritize diversity of content
    for (let post of sortedPosts) {
      // Only include posts with an author property
      if (!post.author || !post.author._id) continue;
      
      // Check for duplicate authors (don't show sequential posts by same author)
      if (
        !authorLastPost.has(post.author._id.toString()) ||
        finalFeed.length - authorLastPost.get(post.author._id.toString()) > 3
      ) {
        finalFeed.push(post);
        authorLastPost.set(post.author._id.toString(), finalFeed.length - 1);
      }
    }

    // If we still don't have enough posts, add any remaining posts
    if (finalFeed.length < 5 && sortedPosts.length > finalFeed.length) {
      for (let post of sortedPosts) {
        if (!finalFeed.some(p => p._id.toString() === post._id.toString())) {
          finalFeed.push(post);
          if (finalFeed.length >= limit) break;
        }

    const { following, preferences } = user

    // Fetch posts from followed users
    let posts = await Post.find({ author: { $in: following } })
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ createdAt: -1 })
      .lean()

    // If not enough posts, fetch from preferences
    if (posts.length < pageLimit) {
      const extraPosts = await Post.find({ category: { $in: preferences } })
        .populate('author', 'username profileImg')
        .populate('comments')
        .sort({ createdAt: -1 })
        .lean()

      posts = [...posts, ...extraPosts]
    }

    // Ensure one author does not dominate the feed
    let finalFeed = []
    let authorLastPost = new Map()

    for (let post of posts) {
      if (
        !authorLastPost.has(post.author._id) ||
        finalFeed.length - authorLastPost.get(post.author._id) > 3
      ) {
        finalFeed.push(post)
        authorLastPost.set(post.author._id, finalFeed.length)
      }
      if (finalFeed.length >= pageLimit) break
    }

    res.status(200).json({ feed: finalFeed, currentPage: page })
  } catch (error) {
    console.error('Error fetching home feed:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Get Explore Feed for a user (Engagement-based)
 */
const getExploreFeed = async (req, res) => {
  try {
    const { id: userId } = req.params
    const { page = 1, limit = 20 } = req.query
    const pageLimit = parseInt(limit)
    const skip = (parseInt(page) - 1) * pageLimit

    const user = await User.findById(userId).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

    const { likedPosts, preferences } = user

    // Get liked post tags
    let likedTags = new Set()
    if (likedPosts.length > 0) {
      const likedPostData = await Post.find({ _id: { $in: likedPosts } }).lean()
      likedPostData.forEach((post) =>
        post.tags.forEach((tag) => likedTags.add(tag)),
      )
    }

    // Fetch posts based on engagement (likes, category, preferences)
    let posts = await Post.find({
      $or: [
        { tags: { $in: Array.from(likedTags) } },
        { category: { $in: preferences } },
      ],
    })
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ likes: -1, comments: -1, createdAt: -1 })
      .lean()

    // Ensure one author does not dominate the feed
    let finalFeed = []
    let authorLastPost = new Map()

    for (let post of posts) {
      if (
        !authorLastPost.has(post.author._id) ||
        finalFeed.length - authorLastPost.get(post.author._id) > 3
      ) {
        finalFeed.push(post)
        authorLastPost.set(post.author._id, finalFeed.length)

      }
      if (finalFeed.length >= pageLimit) break
    }

    console.log(`✅ Returning ${finalFeed.length} posts in the feed`);
    res.status(200).json({ 
      feed: finalFeed.slice(0, limit),
      meta: {
        userId: user._id,
        postCount: finalFeed.length,
        isNewUser: isNewUser
      }
    });
  } catch (error) {
    console.error('❌ Error fetching personalized feed:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });

    res.status(200).json({ feed: finalFeed, currentPage: page })
  } catch (error) {
    console.error('Error fetching explore feed:', error)
    res.status(500).json({ error: 'Internal server error' })

  }
}

module.exports = { getHomeFeed, getExploreFeed }
