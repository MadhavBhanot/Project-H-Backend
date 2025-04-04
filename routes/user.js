const express = require('express')
const userRouter = express.Router()
const { verifyClerkToken } = require('../middleware/clerk/verifyToken.js')
const checkObjectID = require('../middleware/main/checkObjectID')

// protected and needs checking id
userRouter.use(verifyClerkToken)
// userRouter.use(checkObjectID)

// IMPORTANT: Define specific routes BEFORE routes with path parameters
// Add route for suggested users
userRouter.get('/suggested', require('../controllers/user/discoverPeople.js'))

// Routes with path parameters
userRouter.get('/:id', require('../controllers/user/getUserById')) // Get User by Id
userRouter.delete('/:id', require('../controllers/user/deleteUser')) // Delete User
userRouter.post(
  '/follow/:id',
  require('../controllers/user/followOrUnfollowUser'),
) // Follow or Unfllow a User
userRouter.get('/followers/:id', require('../controllers/user/getFollowerList')) // Get User's Follwers List
userRouter.get(
  '/following/:id',
  require('../controllers/user/getFollowingList'),
) // Get User's Following List
userRouter.patch('/:id', require('../controllers/user/updateUser')) // Update User's Profile
userRouter.get(
  '/discover/:id',
  require('../controllers/user/discoverPeople.js'),
)
userRouter.patch('/', require('../controllers/user/updatePrivacy.js'))
userRouter.post(
  '/toggleBlock/:id',
  require('../controllers/user/blockUnblockUser.js'),
)

module.exports = userRouter
