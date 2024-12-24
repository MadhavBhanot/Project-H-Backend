// Get a job by id
const Job = require('../../models/Job')
const getJobByIdHelper = require('../../utils/job/getJobByIdHelper')

async function getJobById(req, res) {
    const data = await getJobByIdHelper(req.params.id)
    if (!data) return res.status(404).json({ message: "Job Not Found", data })
    return res.status(200).json({ message: "Job Retrieved Successfully", data })
}


module.exports = getJobById;