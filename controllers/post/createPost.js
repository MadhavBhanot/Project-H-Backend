const { clerkClient } = require('@clerk/express')
const Post = require('../../models/Post')
const User = require('../../models/User')

// Valid categories list
const validCategories = [
  'Technology',
  'Programming & Development',
  'Data Science & AI',
  'Mathematics & Logic',
  'Engineering',
  'Science & Research',
  'Entrepreneurship & Business',
  'Finance & Investing',
  'Career & Personal Development',
  'Health & Wellness',
  'Books & Literature',
  'Psychology & Mindset',
  'Art & Creativity',
  'History & Philosophy',
  'News & Current Affairs',
  'Entertainment & Media',
]

const createPost = async (req, res) => {
  try {
    const userId = req.userId // Gives the User ID
    const { type } = req.body // Gives the type of post (post or reel)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found.',
      })
    }

    // Pass `userId` directly, as Mongoose expects a string or ObjectId, not an object
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }
    console.log('User found:', user)

    // Log the raw request body and files
    console.log('Request body:', req.body)
    console.log('Request files:', req.files)

    // Handle category field
    let category = 'Technology' // default value
    if (req.body.category) {
      // If it's an array, take the first value, otherwise use the value directly
      category = Array.isArray(req.body.category)
        ? req.body.category[0] || 'Technology'
        : req.body.category

      // Ensure it's a string
      category = String(category).trim()

      // Validate against allowed categories
      if (!validCategories.includes(category)) {
        category = 'Technology' // fallback to default if invalid
      }
    }

    console.log('Category after processing:', {
      raw: req.body.category,
      processed: category,
      type: typeof category,
    })

    // Extract other fields from FormData
    const image = req.body.image
    const caption = req.body.caption
    const filters = req.body.filters
    const location = req.body.location
    const tags = req.body.tags ? JSON.parse(req.body.tags) : []

    // Log the extracted data
    console.log('Extracted data:', {
      caption,
      category,
      filters,
      location,
      tags,
      authorId: user._id,
    })

    // Validate required fields
    if (!caption) {
      return res.status(400).json({
        success: false,
        message: 'Caption is required.',
      })
    }

    console.log('Creating post with data:', {
      caption,
      category,
      filters,
      location,
      tags,
      authorId: user._id,
    })

    try {
      const newPost = new Post({
        image,
        caption,
        author: user._id,
        filters,
        tags,
        location,
        category, // Schema will handle type conversion
        type,
      })

      console.log('Created post instance:', newPost)

      const savedPost = await newPost.save()
      user.posts.push(newPost._id)
      await user.save()

      console.log('Post saved successfully:', savedPost)

      res.status(201).json({
        success: true,
        message: 'Post created successfully.',
        data: savedPost,
      })
    } catch (validationError) {
      console.error('Validation error:', validationError)
      return res.status(400).json({
        success: false,
        message: 'Invalid post data',
        error: validationError.message,
      })
    }
  } catch (error) {
    console.error('Error in createPost:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the post.',
      error: error.message,
    })
  }
}

module.exports = createPost
