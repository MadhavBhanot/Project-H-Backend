// Delete a user
const User = require('../../models/User')

// Delete User by Id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    // Check if id Provided
    if (!id) {
      return res
        .status(404)
        .json({ message: 'User Id is Required', success: false })
    }

    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser)
      return res.status(404).json({ message: 'User not found', success: false })

    return res.status(200).json({
      message: 'User deleted successfully',
      deletedUser,
      success: true,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error deleting user', success: false })
  }
}

module.exports = deleteUser
