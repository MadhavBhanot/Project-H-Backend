const Job = require('../../models/Job')
const User = require('../../models/User')

const saveOrUnsaveAJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    const { id } = req.params // Job ID from request params
    if (!id) {
      return res.status(404).json({ message: 'Job not found', success: false })
    }

    const user = req.user

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false })
    }

    // Check if the job exists
    const job = await Job.findById(id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false })
    }

    // Check if the job is already saved
    const isSaved = user.savedJobs.includes(id)

    if (isSaved) {
      // Unsave the job
      user.savedJobs = user.savedJobs.filter((jobId) => jobId.toString() !== id)
      await user.save()
      return res
        .status(200)
        .json({ message: 'Job unsaved successfully', success: true })
    } else {
      // Save the job
      user.savedJobs.push(id)
      await user.save()
      return res
        .status(200)
        .json({ message: 'Job saved successfully', success: true })
    }
  } catch (error) {
    console.error('Error saving/unsaving job:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = saveOrUnsaveAJob
