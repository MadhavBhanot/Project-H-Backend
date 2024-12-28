const Joi = require('joi')

function validateCreateJob(data) {
    const schema = Joi.object({
        description: Joi.string().required().messages({ 'any.required': 'Description Required' }),
        minReq: Joi.string().required().messages({ 'any.required': 'Minimum Requirement Required' }),
        category: Joi.string().required().valid('Technology', 'Finance', 'Education', 'Healthcare').messages({ 'any.required': 'Category Required' }),
    })
    return schema.validate(data);
}

module.exports = validateCreateJob 