// Get a job by id
const Job = require('../../models/Job')

async function getJobById(req, res) {
    const data = await getJobByIdHelper(req.params.id)
    return res.status(200).json({ message: "Job Retrieved Successfully", data })
}

async function getJobByIdHelper(id) {
    return await Job.findById(id)
}

module.exports = getJobById;