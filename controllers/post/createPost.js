const { clerkClient } = require('@clerk/express')
const Post = require('../../models/Post')
const User = require('../../models/User')

const createPost = async (req, res) => {
  try {
    const userId = req.userId // Gives the User Id

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found.',
      })
    }

    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      console.log('No User')
    }
    console.log('user', user)

    const { image, caption, category } = req.body

    if (!caption || category.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing Required Fields.',
      })
    }

    const newPost = new Post({
      image,
      caption,
      author: userId,
    })

    const savedPost = await newPost.save()

    res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      data: savedPost,
    })
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
