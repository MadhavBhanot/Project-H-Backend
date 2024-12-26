// All the post routes
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth/verifyToken.js')

// Import controllers
// const createPost = require('../controllers/createPost')
const getAllPosts = require('../controllers/post/getAllPost.js')
const getPostById = require('../controllers/post/getPostById.js')
const updatePost = require('../controllers/post/updatePost.js')
const deletePost = require('../controllers/post/deletePost.js')
const likePost = require('../controllers/post/likeOrUnlikePost.js')
const updatePost = require('../controllers/post/updatePost.js')
const addComment = require('../controllers/post/addComment.js')
// const savePost = require('../controllers/savePost')

// Routes for posts
router.post('/create', verifyToken, createPost) // Create a new post
router.get('/all', getAllPosts) // Get all posts
router.get('/:id', getPostById) // Get a specific post
router.patch('/update/:id', verifyToken, updatePost) // Update a post
router.delete('/delete/:id', verifyToken, deletePost) // Delete a post
router.post('/like/:id', verifyToken, likePost) // Like or unlike a post
// router.post('/save/:id', savePost) // Save a post
router.get('/:id/comments', getAllComment) // Get all comments for a post
router.post('/:id/comment', addComment) // Add a comment to a post

module.exports = router
