// Delete a job
const Job = require('../../models/Job')
const User = require('../../models/User')

async function deleteJob(req, res) {
    const job = await Job.findById(req.params.id)
    if (!req.user.isVerified) return res.status(400).json({ message: "Not Verified To Delete a Job" })
    if (!job) return res.status(400).json({ message: "Job Not Found" })
    if (job.postedBy.equals(req.user.userId)) await deleteJob(req.user.userId, job)
    return res.status(200).json({ message: "Job Deleted Successfully" })
}

async function deleteJobHelper(userId, job) {
    await Job.deleteOne(job);
    let user = await User.findById(userId)
    user.postedJobs.pull(job._id)
    await user.save();
}

module.exports = deleteJob;