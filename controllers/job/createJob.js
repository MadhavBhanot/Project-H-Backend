const Job = require('../../models/Job')
const User = require('../../models/User')

const createJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User Not Found', success: false })
    }

    // Uncomment for production to check if the user is verified
    // if (!req.user.isVerified) {
    //   return res.status(400).json({ message: 'User Not Verified', success: false })
    // }

    const {
      position,
      type,
      location,
      description,
      salary,
      duration,
      minReq,
      imageURL,
      category,
      company,
    } = req.body

    // Validate required fields
    if (
      !position ||
      !type ||
      !location ||
      !description ||
      !duration ||
      !minReq ||
      !category ||
      !company
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be filled', success: false })
    }

    // Ensure `type` and `location` are valid enums
    const validTypes = ['full-time', 'part-time', 'contract', 'internship']
    const validLocations = ['remote', 'on-site', 'hybrid']
    const validCategories = ['Technology', 'Finance', 'Education', 'Healthcare']

    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({ message: 'Invalid job type', success: false })
    }

    if (!validLocations.includes(location)) {
      return res
        .status(400)
        .json({ message: 'Invalid job location', success: false })
    }

    if (!validCategories.includes(category)) {
      return res
        .status(400)
        .json({ message: 'Invalid job category', success: false })
    }

    // Create a new job
    const newJob = new Job({
      postedBy: req.user._id,
      position,
      type,
      location,
      description,
      salary: salary || 0, // Default value if salary is not provided
      duration,
      minReq,
      imageURL: imageURL || null, // Default to null if not provided
      category,
      company,
    })

    req.user.postedJobs.push(newJob._id)

    // Save job to the database
    await newJob.save()
    await req.user.save()

    return res.status(201).json({
      message: 'Job created successfully',
      success: true,
      job: newJob,
    })
  } catch (error) {
    console.error('Error creating job:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}

module.exports = createJob
