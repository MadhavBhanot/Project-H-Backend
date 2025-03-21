import Post from '../../models/Post.js'

const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.query

    if (!category) {
      return res
        .status(400)
        .json({ message: 'Category is required', success: false })
    }

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
    if (!validCategories.includes(category)) {
      return res
        .status(400)
        .json({ message: 'Invalid category', success: false })
    }

    const posts = await Post.find({
      category: { $regex: new RegExp(category, 'i') },
    })

    return res.status(200).json({
      message: 'Posts retrieved successfully',
      success: true,
      posts,
    })
  } catch (error) {
    console.error('Error searching jobs:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

export default getPostsByCategory
