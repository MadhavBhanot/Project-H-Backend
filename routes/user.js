// All the user routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth/verifyToken');
const checkObjectID = require('../middleware/main/checkObjectID')

// Import Controller 
const { getUserById } = require('../controllers/user/getUserById');
const { deleteUser } = require('../controllers/user/deleteUser');
const { followUnfollowUser } = require('../controllers/user/followOrUnfollowUser');
const { getFollowers } = require('../controllers/user/getFollowerList');
const { getFollowing } = require('../controllers/user/getFollowingList');
const { updateUserProfile } = require('../controllers/user/updateUser')

// Routes for Users
router.get('/:id', verifyToken, checkObjectID, getUserById); // Get User by Id
router.delete('/:id', verifyToken, checkObjectID, deleteUser); // Delete User
router.post('/:id/follow-unfollow', verifyToken, checkObjectID, followUnfollowUser) // Follow or Unfllow a User
router.get('/:id/followers', verifyToken, checkObjectID, getFollowers) // Get User's Follwers List
router.get('/:id/following', verifyToken, checkObjectID, getFollowing) // Get User's Following List
router.patch('/:id', verifyToken, checkObjectID, updateUserProfile) // Update User's Profile


module.exports = router;


