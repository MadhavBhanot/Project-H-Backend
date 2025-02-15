const Post = require('../../models/Post')
const User = require('../../models/User')

/**
 * Get personalized feed for a user
 */
const getPersonalizedFeed = async (req, res) => {
  try {
    const { id: userId } = req.params // Get userId from request params

    // Fetch user data
    const user = await User.findById(userId).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

    const { following, preferences, likedPosts } = user
    const limit = parseInt(req.query.limit) || 20 // Allow limit as query param

    // Fetch posts based on user preferences
    let preferredPosts = await Post.find({ category: { $in: preferences } })
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Fetch posts from followed users
    let followingPosts = await Post.find({ author: { $in: following } })
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Fetch trending posts
    let trendingPosts = await Post.find({})
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ likes: -1, createdAt: -1 })
      .limit(limit)
      .lean()

    // Fetch posts with tags matching liked posts
    let likedTags = new Set()
    if (likedPosts?.length > 0) {
      const likedPostData = await Post.find({ _id: { $in: likedPosts } }).lean()
      likedPostData.forEach((post) =>
        post.tags.forEach((tag) => likedTags.add(tag)),
      )
    }

    let tagMatchedPosts = await Post.find({
      tags: { $in: Array.from(likedTags) },
    })
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Merge all posts and remove duplicates
    let allPosts = [
      ...preferredPosts,
      ...followingPosts,
      ...trendingPosts,
      ...tagMatchedPosts,
    ]
    let uniquePosts = new Map()
    allPosts.forEach((post) => uniquePosts.set(post._id.toString(), post))

    // Sort posts based on engagement & recency
    let sortedPosts = Array.from(uniquePosts.values()).sort((a, b) => {
      const aScore =
        a.likes.length * 3 +
        a.comments.length * 2 +
        (Date.now() - a.createdAt) / 100000
      const bScore =
        b.likes.length * 3 +
        b.comments.length * 2 +
        (Date.now() - b.createdAt) / 100000
      return bScore - aScore
    })

    // Avoid consecutive posts from the same author
    let finalFeed = []
    let authorLastPost = new Map()
    for (let post of sortedPosts) {
      if (
        !authorLastPost.has(post.author?._id) ||
        finalFeed.length - authorLastPost.get(post.author?._id) > 3
      ) {
        finalFeed.push(post)
        authorLastPost.set(post.author?._id, finalFeed.length)
      }
    }

    res.status(200).json({ feed: finalFeed.slice(0, limit) })
  } catch (error) {
    console.error('Error fetching personalized feed:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = getPersonalizedFeed
