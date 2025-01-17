const { clerkClient } = require('@clerk/express');


const updateUser = async (req, res) => {
    const {username, email, firstName, lastName,phoneNumber,clerkId } = req.body;
  try {
    
    // Update a user in Clerk
    const clerkUser = await clerkClient.users.updateUser({
        userId: clerkId,
        firstName,
        lastName,
        emailAddress:[email],
        phoneNumber:[phoneNumber],
        username,
    });

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
