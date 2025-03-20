const Job = require('../../models/Job')

const searchJobWithTag = async (req, res) => {
  try {
    const { category } = req.query

    if (!category) {
      return res
        .status(400)
        .json({ message: 'Category is required', success: false })
    }

    const validCategories = ['Technology', 'Finance', 'Education', 'Healthcare']
    if (!validCategories.includes(category)) {
      return res
        .status(400)
        .json({ message: 'Invalid category', success: false })
    }

    const jobs = await Job.find({
      category: { $regex: new RegExp(category, 'i') },
    })

    return res.status(200).json({
      message: 'Jobs retrieved successfully',
      success: true,
      jobs,
    })
  } catch (error) {
    console.error('Error searching jobs:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = searchJobWithTag
