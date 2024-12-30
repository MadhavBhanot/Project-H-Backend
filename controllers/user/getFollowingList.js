// Get a user's following list
const User = require('../../models/User');


const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if id Provided
    if (!id) {
      return res.status(404).json({ Status: 0, Message: "User Id is Required" })
    }

    const user = await User.findById(id).populate('following', 'name username profileImg');
    if (!user) return res.status(404).json({ Status: 0, Message: 'User not found' });

    return res.status(200).json({ Status: 1, Message: "User followers Found", Following: user.following });
  } catch (error) {
    return res.status(500).json({ Status: 0, Message: 'Error fetching following', error });
  }
};


module.exports = getFollowing