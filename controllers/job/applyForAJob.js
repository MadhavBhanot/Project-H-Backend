// Apply for a job
const Job = require('../../models/Job')
const User = require('../../models/User')

async function applyForAJob(req, res) {
    let job = await Job.findById(req.params.id)
    if (!job) return res.status(400).json({ message: "Job Not Found" })
    job.applicants.push(req.user.userId)
    let user = await User.findById(req.user.userId)
    user.appliedJobs.push(job._id)
    await job.save()
    await user.save()
    return res.status(200).json({ message: "Application Sent Successfully" })
}

module.exports = applyForAJob;