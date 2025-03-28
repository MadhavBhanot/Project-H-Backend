// Get all jobs
const Job = require('../../models/Job')

async function getAllJobs(req, res) {
  const data = await Job.find()
  const filteredJobs = data.filter(
    (job) => !job.postedBy.blockedUsers.includes(req.user._id),
  )
  return res
    .status(200)
    .json({
      message: 'Job Retrieved Successfully',
      filteredJobs,
      success: true,
    })
}

module.exports = getAllJobs
