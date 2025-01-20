// deleteUserController.js
const { clerkClient } = require('@clerk/express')

// Delete a user from Clerk
const deleteUser = async (req, res) => {
  const { userId } = req.params

  const user = req.auth.user
  console.log('user', user)
  try {
    if (!userId) {
      return res.status(404).json({ Status: 0, message: 'User Id not found' })
    }
    // Delete the user from Clerk
    const clerkResponse = await clerkClient.users.deleteUser(userId)

    // Return success response
    res.status(200).json({
      message: `User with ID ${userId} deleted successfully.`,
      clerkResponse,
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message,
    })
  }
}

module.exports = { deleteUser }
