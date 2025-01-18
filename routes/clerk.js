const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/clerk/createUser');
const { updateUser } = require('../controllers/clerk/updateUser');
const { deleteUser } = require('../controllers/clerk/deleteUser');


router.post('/createUser', createUser);
router.post('/updateUser/:userId', updateUser);
router.delete('/deleteUser/:userId', deleteUser);


module.exports = router;