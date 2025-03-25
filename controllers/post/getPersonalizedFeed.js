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
      .skip(skip)
      .limit(pageLimit)
      .lean()

    // If not enough posts, fetch from preferences
    if (posts.length < pageLimit) {
      const extraPosts = await Post.find({ category: { $in: preferences } })
        .populate('author', 'username profileImg')
        .populate('comments')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit - posts.length)
        .lean()

      posts = [...posts, ...extraPosts]
    }

    res.status(200).json({ feed: posts, currentPage: page })
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

    // Fetch posts based on engagement (likes, tags, preferences)
    let posts = await Post.find({
      $or: [
        { tags: { $in: Array.from(likedTags) } },
        { category: { $in: preferences } },
      ],
    })
      .populate('author', 'username profileImg')
      .populate('comments')
      .sort({ likes: -1, comments: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean()

    res.status(200).json({ feed: posts, currentPage: page })
  } catch (error) {
    console.error('Error fetching explore feed:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getHomeFeed, getExploreFeed }
