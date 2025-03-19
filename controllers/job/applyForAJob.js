const Job = require('../../models/Job')
const User = require('../../models/User')

const applyForAJob = async (req, res) => {
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

    console.log('Job posted by', job.postedBy)
    console.log('Job posted by', req.user._id)
    if (job.postedBy.toString() === req.user._id.toString()) {
      console.log('HEre')
      return res
        .status(400)
        .json({ message: 'You cannot apply for your own job', success: false })
    }

    // Check if the user has already applied
    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({
        message: 'You have already applied for this job',
        success: false,
      })
    }

    // Add user to applicants list
    job.applicants.push(req.user._id)
    await job.save()

    // Add the job in users applied jobs as well
    req.user.appliedJobs.push(job._id)
    await req.user.save()

    return res
      .status(200)
      .json({ message: 'Successfully applied for the job', success: true })
  } catch (error) {
    console.error('Error applying for job:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = applyForAJob
