const Post = require('../../models/Post')
const User = require('../../models/User')

/**
 * Fetch personalized home feed for a user
 * @param {String} userId - The ID of the logged-in user
 * @param {Number} limit - Number of posts to fetch
 * @returns {Array} - List of personalized posts
 */
const getPersonalizedFeed = async (userId, limit = 20) => {
  console.log('Hit')
  const { id } = req.params

  try {
    // Fetch user data
    const user = await User.findById(userId).lean()
    if (!user) throw new Error('User not found')

    const { following, preferences, likedPosts } = user

    // Step 1: Fetch posts based on user preferences and categories
    let preferredPosts = await Post.find({
      category: { $in: preferences },
    })
      .populate('author', 'username profileImg') // Fetch author details
      .populate('comments')
      .sort({ createdAt: -1 }) // Sort by newest
      .limit(limit)
      .lean()

    // Step 2: Fetch posts from users the user follows
    let followingPosts = await Post.find({
      author: { $in: following },
    })
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Step 3: Fetch trending posts (high engagement)
    let trendingPosts = await Post.find({})
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ likes: -1, createdAt: -1 }) // Sort by highest likes first
      .limit(limit)
      .lean()

    // Step 4: Fetch posts with tags that match the user's liked posts
    let likedTags = new Set()
    if (likedPosts.length > 0) {
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

    // Merge results without duplicates
    let allPosts = [
      ...preferredPosts,
      ...followingPosts,
      ...trendingPosts,
      ...tagMatchedPosts,
    ]
    let uniquePosts = new Map()
    allPosts.forEach((post) => uniquePosts.set(post._id.toString(), post))

    // Convert back to array & apply sorting formula
    let sortedPosts = Array.from(uniquePosts.values()).sort((a, b) => {
      const aScore =
        a.likes.length * 3 +
        a.comments.length * 2 +
        (Date.now() - a.createdAt) / 100000
      const bScore =
        b.likes.length * 3 +
        b.comments.length * 2 +
        (Date.now() - b.createdAt) / 100000
      return bScore - aScore // Higher score means higher priority
    })

    // Step 5: Diversity - Avoid too many posts from the same author consecutively
    let finalFeed = []
    let authorLastPost = new Map()

    for (let post of sortedPosts) {
      if (
        !authorLastPost.has(post.author._id) ||
        finalFeed.length - authorLastPost.get(post.author._id) > 3
      ) {
        finalFeed.push(post)
        authorLastPost.set(post.author._id, finalFeed.length)
      }
    }

    return finalFeed.slice(0, limit) // Return only requested number of posts
  } catch (error) {
    console.error('Error fetching personalized feed:', error)
    return []
  }
}

module.exports = getPersonalizedFeed
