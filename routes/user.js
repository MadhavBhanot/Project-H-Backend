// All the user routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth/verifyToken');

// Import Controller 
const { getUserById } = require('../controllers/user/getUserById');
const { deleteUser } = require('../controllers/user/deleteUser');
const { followUnfollowUser } = require('../controllers/user/followOrUnfollowUser');
const { getFollowers } = require('../controllers/user/getFollowerList');
const { getFollowing } = require('../controllers/user/getFollowingList');

// Routes for Users
router.get('/:id', verifyToken, getUserById); // Get User by Id
router.delete('/:id', verifyToken, deleteUser); // Delete User
router.post('/:id/follow-unfollow', verifyToken, followUnfollowUser) // Follow or Unfllow a User
router.get('/:id/followers', verifyToken, getFollowers) // Get User's Follwers List
router.get('/:id/following', verifyToken, getFollowing) // Get User's Following List


module.exports = router;


