const User = require('../../models/User')

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params

    // Check if ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ message: 'User Id is Required', success: false })
    }

    // Ensure the logged-in user can only update their own profile
    if (req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({
          message: 'Unauthorized: You can only update your own profile',
          success: false,
        })
    }

    const updates = { ...req.body }
    delete updates.password // Ensure password is not updated

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates, // Dynamically update fields based on req.body
      { new: true, runValidators: true }, // Return the updated user and run validators
    ).select('-password') // Exclude password from the response

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found', success: false })
    }

    return res.status(200).json({
      message: 'User Profile Updated Successfully',
      data: updatedUser,
      success: true,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

module.exports = updateUserProfile
