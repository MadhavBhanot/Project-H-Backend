const Job = require('../../models/Job')

const getAllApplicantsForAJob = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res
      .status(404)
      .json({ message: 'Job Id is Required', success: false })
  }

  try {
    const job = await Job.findById(id).populate('applicants')
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false })
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You cannotsee the details of applicants',
        success: false,
      })
    }

    return res.status(200).json({
      message: 'Applicants retrieved successfully',
      success: true,
      applicants: job.applicants,
    })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

module.exports = getAllApplicantsForAJob
