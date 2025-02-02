const { clerkClient } = require('@clerk/express');

const getUser = async (req, res) => {
  const { clerkId } = req.params;

  try {
    console.log('🔍 Getting Clerk user with ID:', clerkId);

    if (!clerkId) {
      console.log('❌ No Clerk ID provided');
      return res.status(400).json({
        success: false,
        message: 'Clerk ID is required'
      });
    }

    // Get user from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);
    console.log('📦 Raw Clerk user data:', JSON.stringify(clerkUser, null, 2));
    
    if (!clerkUser) {
      console.log('❌ No user found in Clerk');
      return res.status(404).json({
        success: false,
        message: 'User not found in Clerk'
      });
    }

    // Get primary email and image URL with fallbacks
    const primaryEmail = clerkUser.emailAddresses?.find(email => email.id === clerkUser.primaryEmailAddressId);
    
    // Try multiple image sources
    let imageUrl = null;
    if (clerkUser.imageUrl) {
      imageUrl = clerkUser.imageUrl;
    } else if (clerkUser.profileImageUrl) {
      imageUrl = clerkUser.profileImageUrl;
    } else if (clerkUser.avatarUrl) {
      imageUrl = clerkUser.avatarUrl;
    }

    // Return user data
    const userData = {
      success: true,
      user: {
        id: clerkUser.id,
        username: clerkUser.username,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: imageUrl,
        email: primaryEmail?.emailAddress
      }
    };

    console.log('✅ Returning user data:', userData);
    res.status(200).json(userData);

  } catch (error) {
    console.error('❌ Error getting Clerk user:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user from Clerk',
      error: error.message
    });
  }
};

module.exports = { getUser }; 