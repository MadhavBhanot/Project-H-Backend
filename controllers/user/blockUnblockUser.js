const User = require('../../models/User.js')

const blockUnblockUser = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'Id is required', success: false })
  }
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false })
    }

    if (user.blockedUsers.includes(req.user._id)) {
      user.blockedUsers.pull(req.user._id)
      await user.save()
      return res
        .status(200)
        .json({ message: 'User unblocked successfully', success: true })
    } else {
      user.blockedUsers.push(req.user._id)
      await user.save()
      return res
        .status(200)
        .json({ message: 'User blocked successfully', success: true })
    }
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}
module.exports = blockUnblockUser
