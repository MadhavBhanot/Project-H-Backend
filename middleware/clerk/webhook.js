const { Webhook } = require('svix')
const User = require('../../models/User')
require('dotenv').config()

// Webhook secret from Clerk Dashboard (add it to your environment variables)
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

// Function to handle the webhook events
const webhookHandler = async (req, res) => {
  const payload = req.body
  const headers = req.headers

  console.log('Webhook received:', {
    type: headers['svix-event-type'],
    id: headers['svix-id']
  })

  try {
    const wh = new Webhook(WEBHOOK_SECRET)
    const evt = wh.verify(payload.toString(), {
      'svix-id': headers['svix-id'],
      'svix-timestamp': headers['svix-timestamp'],
      'svix-signature': headers['svix-signature']
    })

    const { type, data } = evt
    console.log('Processing webhook:', { type, data })

    switch (type) {
      case 'user.created':
        await handleUserCreated(data)
        break
      case 'user.updated':
        await handleUserUpdated(data)
        break
      case 'user.deleted':
        await handleUserDeleted(data)
        break
      case 'email.verified':
        await handleEmailVerified(data)
        break
      default:
        console.log('Unhandled webhook type:', type)
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(400).json({
      success: false,
      error: err.message
    })
  }
}

async function handleUserCreated(data) {
  try {
    console.log('Creating user from webhook:', data)
    const user = new User({
      clerkId: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email_addresses[0].email_address,
      username: data.username,
      isVerified: data.email_addresses[0].verification?.status === 'verified'
    })
    await user.save()
    console.log('User created in MongoDB:', user._id)
  } catch (error) {
    console.error('Error creating user from webhook:', error)
  }
}

async function handleUserUpdated(data) {
  try {
    console.log('Updating user from webhook:', data)
    const user = await User.findOne({ clerkId: data.id })
    if (!user) {
      console.log('User not found for update:', data.id)
      return
    }

    user.firstName = data.first_name
    user.lastName = data.last_name
    user.email = data.email_addresses[0].email_address
    user.username = data.username
    user.isVerified = data.email_addresses[0].verification?.status === 'verified'

    await user.save()
    console.log('User updated in MongoDB:', user._id)
  } catch (error) {
    console.error('Error updating user from webhook:', error)
  }
}

async function handleUserDeleted(data) {
  try {
    console.log('Deleting user from webhook:', data)
    const result = await User.deleteOne({ clerkId: data.id })
    console.log('User deleted from MongoDB:', result)
  } catch (error) {
    console.error('Error deleting user from webhook:', error)
  }
}

async function handleEmailVerified(data) {
  try {
    console.log('Handling email verification from webhook:', data)
    const user = await User.findOne({ clerkId: data.user_id })
    if (!user) {
      console.log('User not found for email verification:', data.user_id)
      return
    }

    user.isVerified = true
    await user.save()
    console.log('User email verified in MongoDB:', user._id)
  } catch (error) {
    console.error('Error handling email verification from webhook:', error)
  }
}

module.exports = { webhookHandler }
