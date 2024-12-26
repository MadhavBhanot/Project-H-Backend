// Get all applicants for a job
const Job = require('../../models/Job')
const getJobByIdHelper = require('../../utils/job/getJobByIdHelper')

async function getJobApplicants(req, res) {
    const job = await getJobByIdHelper(req.params.id)
    if (!req.user.isVerified) return res.status(400).json({ message: "Not Verified To Delete a Job" })
    if (!job) return res.status(400).json({ message: "Job Not Found" })
    if (job.postedBy.equals(req.user.userId)) {
        return res.status(200).json({ message: "Job Applicants Retrieved Successfully", data: job.applicants })
    }
    return res.status(200).json({ message: "Not Authorized To Check Applicants For This Job" })
}

module.exports = getJobApplicants;