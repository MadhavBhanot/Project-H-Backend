const Post = require('../../models/Post')
const User = require('../../models/User')

/**
 * Get Home Feed for a user (Following-based)
 */
const getHomeFeed = async (req, res) => {
  try {
    const { id: userId } = req.params
    const { page = 1, limit = 20 } = req.query
    const pageLimit = parseInt(limit)
    const skip = (parseInt(page) - 1) * pageLimit

    const user = await User.findById(userId).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

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

    res.status(200).json({ feed: finalFeed, currentPage: page })
  } catch (error) {
    console.error('Error fetching explore feed:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getHomeFeed, getExploreFeed }
