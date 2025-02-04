const express = require('express')
const postRouter = express.Router()
const checkObjectID = require('../middleware/main/checkObjectID')
const upload = require('../utils/main/imageUploading')
const { verifyClerkToken } = require('../middleware/clerk/verifyToken.js')
const createPost = require('../controllers/post/createPost')
const getUserPosts = require('../controllers/post/getUserPosts')
const deletePost = require('../controllers/post/deletePost')

// Unprotected routes
postRouter.get('/all', require('../controllers/post/getAllPost.js')) // Get all posts
postRouter.get('/user/:userId', getUserPosts) // Get posts for a specific user
postRouter.get('/:id', checkObjectID, require('../controllers/post/getPostById.js')) // Get a specific post
postRouter.delete('/:id', checkObjectID, deletePost) // Delete a post with objectID validation

// Protected routes
postRouter.use(verifyClerkToken)

// Post creation
postRouter.post('/create', upload.single('image'), createPost) // Create a new post

// Post interactions
postRouter.post('/like/:id', require('../controllers/post/likeOrUnlikePost.js')) // Like or unlike a post
postRouter.get('/like/:id', require('../controllers/post/getAllLikesFoPost.js')) // Get all likes for a post
postRouter.post('/save/:id', require('../controllers/post/savePost.js')) // Save a post
postRouter.get('/comment/:id', require('../controllers/post/getAllComment.js')) // Get all comments for a post
postRouter.post('/comment/:id', require('../controllers/post/addComment.js')) // Add a comment to a post

// Post management
postRouter.patch('/update/:id', require('../controllers/post/updatePost.js')) // Update a post

module.exports = postRouter
