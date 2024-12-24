// Get all jobs
const Job = require('../../models/Job')

async function getAllJobs(req, res) {
    const data = await getAllJobsHelper()
    return res.status(200).json({ message: "Job Retrieved Successfully", data })
}

async function getAllJobsHelper() {
    return await Job.find()
}

module.exports = getAllJobs;