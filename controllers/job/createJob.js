// Create a job
const Joi = require('joi')
const Job = require('../../models/Job')

async function httpCreateJob(req, res) {
    const { error } = validateCreateJob(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const data = {
        postedBy: req.user.userId,
        description: req.body.description,
        minReq: req.body.minReq,
        category: req.body.category,
        imageURL: req.body.imageURL || null,
    };
    await createJob(data);
    return res.status(200).json({ message: "Job Created Successfully" })
}

function validateCreateJob(data) {
    const schema = Joi.object({
        description: Joi.string().required().messages({ 'any.required': 'Description Required' }),
        minReq: Joi.string().required().messages({ 'any.required': 'Minimum Requirement Required' }),
        category: Joi.string().required().valid('Technology', 'Finance', 'Education', 'Healthcare').messages({ 'any.required': 'Category Required' }),
        imageURL: Joi.string().optional(),
    })
    return schema.validate(data);
}

async function createJob(data) {
    await Job.create(data)
}

module.exports = httpCreateJob;