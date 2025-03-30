const Job = require('../../models/Job')

const getAllApplicantsForAJob = async (req, res) => {
  try {
    const { id } = req.params
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query

    if (!id) {
      return res
        .status(400)
        .json({ message: 'Job Id is Required', success: false })
    }

    const job = await Job.findById(id)
      .populate('applicants')
      .select('-password')

    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false })
    }

    // Check if the user is the job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You cannot see the details of applicants',
        success: false,
      })
    }

    // Pagination and sorting
    const pageNumber = parseInt(page, 10) || 1
    const limitNumber = parseInt(limit, 10) || 10
    const skip = (pageNumber - 1) * limitNumber
    const sortOrder = order === 'asc' ? 1 : -1

    // Sort and paginate applicants
    const sortedApplicants = job.applicants
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder * a.name.localeCompare(b.name)
        }
        return sortOrder * (new Date(b.createdAt) - new Date(a.createdAt))
      })
      .slice(skip, skip + limitNumber)

    return res.status(200).json({
      message: 'Applicants retrieved successfully',
      success: true,
      data: sortedApplicants,
      totalApplicants: job.applicants.length,
      totalPages: Math.ceil(job.applicants.length / limitNumber),
      currentPage: pageNumber,
    })
  } catch (err) {
    console.error('Error retrieving applicants:', err)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

module.exports = getAllApplicantsForAJob
