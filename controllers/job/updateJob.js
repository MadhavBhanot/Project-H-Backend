const Job = require('../../models/Job')

const updateJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    const { id } = req.params
    const jobUpdates = req.body

    // Find the job
    const job = await Job.findById(id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false })
    }

    // Check if the logged-in user is the one who posted the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'You can only update your own job', success: false })
    }

    // Apply the partial update using PATCH
    Object.keys(jobUpdates).forEach((key) => {
      job[key] = jobUpdates[key]
    })

    await job.save()

    return res
      .status(200)
      .json({ message: 'Job updated successfully', success: true, job })
  } catch (error) {
    console.error('Error updating job:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = updateJob
