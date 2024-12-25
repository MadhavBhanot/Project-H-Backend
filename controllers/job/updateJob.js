// Update a job
const Job = require('../../models/Job')

async function updateJob(req, res) {
    const job = await Job.findById(req.params.id)
    if (!req.user.isVerified) return res.status(400).json({ message: "Not Verified To Update a Job" })
    if (!job) return res.status(400).json({ message: "Job Not Found" })
    if (job.postedBy.equals(req.user.userId)) await updateJobHelper(job, req.body)
    return res.status(200).json({ message: "Job Updated Successfully" })
}

async function updateJobHelper(job, data) {
    await job.updateOne(data)
    await job.save()
}

module.exports = updateJob;