// Get all jobs
const Job = require('../../models/Job')

async function getAllJobs(req, res) {
    const data = await Job.find()
    return res.status(200).json({ message: "Job Retrieved Successfully", data })
}

module.exports = getAllJobs;