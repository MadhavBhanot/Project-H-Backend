const User = require('../../models/User')

const updatePrivacy = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false })
    }

    user.isPrivateAccount = !user.isPrivateAccount
    await user.save()
    return res.status(200).json({ message: 'Privacy updated', success: true })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

module.exports = updatePrivacy
