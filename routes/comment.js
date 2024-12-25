// All the comment routes
const express = require('express');
const commentRouter = express.Router();
const verifyToken = require('../middleware/auth/verifyToken')
const checkObjectID = require('../middleware/main/checkObjectID')

commentRouter.get('/comments/:id', verifyToken, checkObjectID, require('../controllers/comment/getCommentById'));
commentRouter.patch('/comments/:id', verifyToken, checkObjectID, require('../controllers/comment/updateComment'));
commentRouter.delete('/comments/:id', verifyToken, checkObjectID, require('../controllers/comment/deleteComment'));
commentRouter.post('/comments/:id/reply', verifyToken, checkObjectID, require('../controllers/comment/replyToComment'));
commentRouter.get('/comments/:id/replies', verifyToken, checkObjectID, require('../controllers/comment/getAllReplies'));

module.exports = commentRouter;