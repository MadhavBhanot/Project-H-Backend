const Job = require('../../models/Job')

const deleteJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    const { id } = req.params

    // Check if job exists
    const job = await Job.findById(id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false })
    }

    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied', success: false })
    }

    // Delete the job
    await Job.findByIdAndDelete(id)
    req.user.postedJobs.pop(id)
    await req.user.save()

    return res
      .status(200)
      .json({ message: 'Job deleted successfully', success: true })
  } catch (error) {
    console.error('Error deleting job:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = deleteJob
