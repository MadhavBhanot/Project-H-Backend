// All the user routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth/verifyToken');

// Import Controller 
const { getUserById } = require('../controllers/user/getUserById');
const { deleteUser } = require('../controllers/user/deleteUser');

// Routes for Users
router.get('/:id', verifyToken, getUserById); // Get User by Id
router.delete('/:id', verifyToken, deleteUser); // Delete User


module.exports = router;


