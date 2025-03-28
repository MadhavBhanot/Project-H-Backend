const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');

// Import controllers
const messageController = require('../controllers/chat/messageController');
const groupController = require('../controllers/chat/groupController');
const privateChatController = require('../controllers/chat/privateChatController');
const chatController = require('../controllers/chat/chatController');
const notificationController = require('../controllers/chat/notificationController');

// Middleware
router.use(requireAuth);

// Chat overview routes
router.get('/all', chatController.getAllChats);
router.get('/unread', chatController.getUnreadCount);
router.get('/search', chatController.searchChats);

// Messages routes
router.post('/messages', messageController.sendMessage);
router.get('/messages/:chatId', chatController.getChatMessages);
router.put('/messages/:messageId/read', messageController.markAsRead);
router.put('/messages/read', messageController.markAllAsRead);
router.delete('/messages/:messageId', messageController.deleteMessage);

// Private chat routes
router.post('/private', privateChatController.createOrGetPrivateChat);
router.get('/private/:chatId', privateChatController.getPrivateChatDetails);
router.get('/private', privateChatController.getUserPrivateChats);
router.put('/private/:chatId/block', privateChatController.toggleBlockUser);
router.delete('/private/:chatId', privateChatController.deletePrivateChat);

// Group chat routes
router.post('/group', groupController.createGroup);
router.get('/group/:groupId', groupController.getGroupDetails);
router.get('/group', groupController.getUserGroups);
router.put('/group/:groupId', groupController.updateGroup);
router.post('/group/:groupId/members', groupController.addMembers);
router.delete('/group/:groupId/members/:memberId', groupController.removeMember);
router.put('/group/:groupId/members/:memberId/role', groupController.changeMemberRole);

// Notification routes
router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:notificationId/read', notificationController.markAsRead);
router.put('/notifications/read', notificationController.markAllAsRead);
router.delete('/notifications/:notificationId', notificationController.deleteNotification);
router.delete('/notifications', notificationController.deleteAllNotifications);

module.exports = router; 