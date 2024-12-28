// Create a job
const Job = require('../../models/Job')
const User = require('../../models/User')
const validateCreateJob = require('../../utils/job/createJobValidation')

async function createJob(req, res) {
    const { error } = validateCreateJob(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    if (!req.user.isVerified) return res.status(400).json({ message: "Not Verified To Post a Job" })
    const data = {
        postedBy: req.user.userId,
        description: req.body.description,
        minReq: req.body.minReq,
        category: req.body.category,
        imageURL: req.file?.filename || null,
    };
    const job = await createJobHelper(data);
    await addPostedJob(req.user.userId, job._id)
    return res.status(200).json({ message: "Job Created Successfully" })
}

async function createJobHelper(data) {
    return await Job.create(data)
}

async function addPostedJob(userId, jobId) {
    let user = await User.findById(userId)
    user.postedJobs.push(jobId)
    await user.save()
}

module.exports = createJob;