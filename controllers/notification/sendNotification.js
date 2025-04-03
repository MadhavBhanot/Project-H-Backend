const { Expo } = require('expo-server-sdk')
const User = require('../../models/User')
const Notification = require('../../models/Notification')
const expo = new Expo()

/**
 * Send a push notification to a user
 */
const sendNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body

    // Validate input
    if (!title || !message || !type) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields.' })
    }

    // Fetch user with selected fields only
    const user = await User.findById(req.user._id)
      .select('pushNotificationToken')
      .lean()
    if (!user?.pushNotificationToken) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found or no push token.' })
    }

    const pushToken = user.pushNotificationToken

    // Validate Expo push token
    if (!Expo.isExpoPushToken(pushToken)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Expo push token.' })
    }

    // Construct notification payload
    const notificationPayload = {
      to: pushToken,
      sound: 'default',
      title,
      body: message,
      data: { type },
    }

    // Send notification asynchronously
    const ticket = await expo.sendPushNotificationsAsync([notificationPayload])

    // Save notification in DB asynchronously
    const notificationPromise = Notification.create({
      userId: user._id,
      type,
      title,
      message,
    })

    await notificationPromise // Ensure DB operation completes

    return res.status(200).json({
      success: true,
      message: 'Notification sent successfully.',
      ticket,
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' })
  }
}

module.exports = sendNotification
