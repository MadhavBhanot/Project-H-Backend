const Job = require('../../models/Job')

const getJobById = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res
        .status(404)
        .json({ message: 'Job Id is Required', success: false })
    }

    const job = await Job.findById(id).populate('applicants postedBy')
    if (!job) {
      return res.status(404).json({ message: 'Job Not Found', success: false })
    }

    return res
      .status(200)
      .json({ message: 'Job retrieved successfully', success: true, job })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

module.exports = getJobById
