const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { 
      clerkId, 
      email, 
      username, 
      firstName, 
      lastName, 
      imageUrl, 
      strategy 
    } = req.body;

    console.log('👤 Login attempt:', { clerkId, email, strategy });

    // Allow email-only login - modify the check to require only email
    if (!email) {
      console.error('❌ Missing required email for login');
      return res.status(400).json({
        status: 'error',
        message: 'Email is required for login'
      });
    }

    // First check if this exact Clerk ID exists (if provided)
    let userByClerkId = clerkId ? await User.findOne({ clerkId }) : null;
    
    // Also check if the email exists
    let userByEmail = await User.findOne({ email });

    // Detect conflicting accounts (different Clerk ID but same email)
    if (userByEmail && userByClerkId && userByEmail._id.toString() !== userByClerkId._id.toString()) {
      console.error('⚠️ Conflicting accounts detected:', {
        clerkIdUser: userByClerkId._id,
        emailUser: userByEmail._id
      });
      
      // For third-party auth, we should update the user with the new provider ID
      if (strategy === 'github' || strategy === 'google') {
        console.log('🔄 Third-party login - updating existing account with new Clerk ID');
        
        // Update the email-based user with the new Clerk ID
        userByEmail.clerkId = clerkId;
        await userByEmail.save();
        
        // Use the email-based user going forward
        userByClerkId = null;
        user = userByEmail;
      } else {
        // For manual login, treat this as a conflict
        return res.status(409).json({
          status: 'error',
          message: 'Account conflict detected. Please contact support.'
        });
      }
    }

    // Determine which user to use (prefer clerk ID match)
    let user = userByClerkId || userByEmail;
    
    // If we found a user by email but not by clerkId, and clerkId is provided,
    // update the user's clerkId field
    if (userByEmail && !userByClerkId && clerkId) {
      console.log('🔄 Updating existing user with new Clerk ID:', { 
        oldClerkId: userByEmail.clerkId, 
        newClerkId: clerkId 
      });
      
      userByEmail.clerkId = clerkId;
      await userByEmail.save();
      user = userByEmail;
    }

    // If no user exists, create a new one
    if (!user) {
      console.log('🆕 Creating new user:', { clerkId, email, strategy });
      
      // Generate a unique username if not provided
      const finalUsername = username || generateUniqueUsername(email);
      
      user = new User({
        clerkId: clerkId || 'pending-' + Date.now(), // If no clerkId, create a placeholder
        email,
        username: finalUsername,
        firstName,
        lastName,
        profileImg: imageUrl,
        authProvider: strategy || 'email', // Track which provider was used
      });
      
      await user.save();
      console.log('✅ New user created:', user._id);
    } 
    // If we have a user by email but with a different clerkId, update the clerkId
    else if (userByEmail && clerkId && userByEmail.clerkId !== clerkId) {
      console.log('🔄 Updating existing user with new Clerk ID:', { 
        oldClerkId: userByEmail.clerkId, 
        newClerkId: clerkId 
      });
      
      user.clerkId = clerkId;
      // Update auth provider if it's a third-party login
      if (strategy && strategy !== 'email') {
        user.authProvider = strategy;
      }
      await user.save();
    }
    // If we have a matching user but some details have changed, update them
    else if (user) {
      let needsUpdate = false;
      
      // Update user fields if they've changed
      if (email && user.email !== email) {
        user.email = email;
        needsUpdate = true;
      }
      
      if (firstName && user.firstName !== firstName) {
        user.firstName = firstName;
        needsUpdate = true;
      }
      
      if (lastName && user.lastName !== lastName) {
        user.lastName = lastName;
        needsUpdate = true;
      }
      
      if (imageUrl && user.profileImg !== imageUrl) {
        user.profileImg = imageUrl;
        needsUpdate = true;
      }
      
      // Update auth provider if it's a third-party login
      if (strategy && strategy !== 'email' && (!user.authProvider || user.authProvider !== strategy)) {
        user.authProvider = strategy;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log('🔄 Updating user profile data');
        await user.save();
      }
    }
    
    // Generate JWT token for authentication
    console.log('🔑 Generating token for user:', user._id);
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15d' }
    );
    
    // Add last login timestamp
    user.lastLogin = new Date();
    await user.save();
    
    // Send successful response with token
    console.log('✅ Login successful for user:', user._id);
    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImg: user.profileImg,
          authProvider: user.authProvider || 'email'
        }
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during login',
      error: error.message
    });
  }
};

// Helper function to generate a unique username from email
const generateUniqueUsername = (email) => {
  // Extract username part from email and add random digits
  const baseUsername = email.split('@')[0];
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${baseUsername}${randomDigits}`;
};

module.exports = login;
