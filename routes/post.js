// All the post routes
const express = require('express');
const router = express.Router();

// Import controllers
const createPost = require('../controllers/createPost');
const getAllPosts = require('../controllers/getAllPosts');
const getPostById = require('../controllers/getPostById');
const updatePost = require('../controllers/updatePost');
const deletePost = require('../controllers/deletePost');
const likePost = require('../controllers/likePost');
const savePost = require('../controllers/savePost');

// Routes for posts
router.post('/api/post/create', createPost);          // Create a new post
router.get('/api/post/all', getAllPosts);            // Get all posts
router.get('/api/post/:id', getPostById);            // Get a specific post
router.put('/api/post/update/:id', updatePost);      // Update a post
router.delete('/api/post/delete/:id', deletePost);   // Delete a post
router.post('/api/post/like/:id', likePost);         // Like or unlike a post
router.post('/api/post/save/:id', savePost);         // Save a post

module.exports = router;
