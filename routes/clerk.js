const express = require('express');
const router = express.Router();
const { verifyTokenMiddleware } = require('../middleware/clerk/verifyTokenMiddleware');

const { createUser } = require('../controllers/clerk/createUser');
const { updateUser } = require('../controllers/clerk/updateUser');
const { deleteUser } = require('../controllers/clerk/deleteUser');


router.post('/createUser', createUser);
router.post('/updateUser/:userId', updateUser);
router.delete('/deleteUser/:userId', verifyTokenMiddleware, deleteUser);


module.exports = router;