const express = require('express');
const userRouter = express.Router();
const verifyToken = require('../middleware/auth/verifyToken');
const checkObjectID = require('../middleware/main/checkObjectID')

// protected and needs checking id 
userRouter.use(verifyToken)
userRouter.use(checkObjectID)

userRouter.get('/:id', require('../controllers/user/getUserById')); // Get User by Id
userRouter.delete('/:id', require('../controllers/user/deleteUser')); // Delete User
userRouter.post('/:id/follow-unfollow', require('../controllers/user/followOrUnfollowUser')) // Follow or Unfllow a User
userRouter.get('/:id/followers', require('../controllers/user/getFollowerList')) // Get User's Follwers List
userRouter.get('/:id/following', require('../controllers/user/getFollowingList')) // Get User's Following List
userRouter.patch('/:id', require('../controllers/user/updateUser')) // Update User's Profile

module.exports = userRouter;