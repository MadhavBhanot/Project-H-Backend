// All the user routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth/verifyToken');

// Import Controller 
const { getUserById } = require('../controllers/user/getUserById');

// Routes for Users
router.get('/:id', verifyToken, getUserById); // Get User by Id


module.exports = router;


