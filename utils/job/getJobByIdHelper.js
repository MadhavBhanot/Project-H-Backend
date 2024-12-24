const Job = require('../../models/Job')

async function getJobByIdHelper(id) {
    return await Job.findById(id)
}

module.exports = getJobByIdHelper