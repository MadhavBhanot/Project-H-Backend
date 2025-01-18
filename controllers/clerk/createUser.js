const { clerkClient } = require('@clerk/express');


// Create a new user in Clerk and save the user data in MongoDB
const createUser = async (req, res) => {
    const {username, email, password, firstName, lastName,phoneNumber} = req.body;
  try {

    // Create a user in Clerk
    const clerkUser = await clerkClient.users.createUser({
        firstName,
        lastName,
        emailAddress:[email],
        // phoneNumber:[phoneNumber],
        username,
        password, // Min 8 Character Required
    });

    console.log("ClerkUser User data", clerkUser)

    res.status(201).json({
      message: 'User created successfully',
      user: clerkUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

module.exports = { createUser };
