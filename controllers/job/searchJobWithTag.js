const Job = require('../../models/Job')

const searchJobWithTag = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query

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

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10) || 1
    const limitNumber = parseInt(limit, 10) || 10
    const skip = (pageNumber - 1) * limitNumber

    // Get total job count
    const totalJobs = await Job.countDocuments({
      category: { $regex: new RegExp(category, 'i') },
    })

    // Fetch jobs with pagination
    const jobs = await Job.find({
      category: { $regex: new RegExp(category, 'i') },
    })
      .skip(skip)
      .limit(limitNumber)

    // Filter out jobs posted by blocked users
    const filteredJobs = jobs.filter(
      (job) => !job.postedBy.blockedUsers.includes(req.user._id),
    )

    return res.status(200).json({
      message: 'Jobs retrieved successfully',
      success: true,
      data: filteredJobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limitNumber),
      currentPage: pageNumber,
    })
  } catch (error) {
    console.error('Error searching jobs:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = searchJobWithTag
