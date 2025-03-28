const Job = require('../../models/Job')

async function getAllJobs(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10) || 1
    const limitNumber = parseInt(limit, 10) || 10
    const skip = (pageNumber - 1) * limitNumber

    // Convert order to sorting format
    const sortOrder = order === 'asc' ? 1 : -1

    // Get total count of jobs
    const totalJobs = await Job.countDocuments()

    // Fetch jobs with pagination and sorting
    const jobs = await Job.find()
      .sort({ [sortBy]: sortOrder }) // Sort dynamically
      .skip(skip)
      .limit(limitNumber)

    // Filter out jobs posted by blocked users
    const filteredJobs = jobs.filter(
      (job) => !job.postedBy.blockedUsers.includes(req.user._id),
    )

    return res.status(200).json({
      message: 'Jobs Retrieved Successfully',
      success: true,
      data: filteredJobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limitNumber),
      currentPage: pageNumber,
    })
  } catch (error) {
    console.error('Error retrieving jobs:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = getAllJobs
