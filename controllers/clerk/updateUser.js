const { clerkClient } = require('@clerk/express');


const updateUser = async (req, res) => {
    const {username, email, firstName, lastName,phoneNumber } = req.body;
    const { userId } = req.param;
  try {

    if(!userId){
        return res.status(404).json({ Status: 0, message: 'User Id not found' });
    }
    
    // Update a user in Clerk
    const clerkUser = await clerkClient.users.updateUser(
        { userId },
        {
            firstName,
            lastName,
            emailAddress:[email],
            phoneNumber:[phoneNumber],
            username,
        }
    );

    console.log("ClerkUser User data", clerkUser)

    res.status(202).json({
      message: 'User updated Successfully',
      user: clerkUser
    });
  } catch (error) {
    console.error('Error Updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

module.exports = { updateUser };
