// All the job routes
const express = require('express');
const jobRouter = express.Router();
const verifyToken = require('../middleware/auth/verifyToken')
const checkObjectID = require('../middleware/main/checkObjectID')
const upload = require('../utils/main/imageUploading');

jobRouter.post('/create-job', verifyToken, upload.single('imageURL'), require('../controllers/job/createJob'));
jobRouter.get('/', verifyToken, require('../controllers/job/getAllJob'));
jobRouter.get('/:id', verifyToken, checkObjectID, require('../controllers/job/getJobById'));
jobRouter.delete('/:id', verifyToken, checkObjectID, require('../controllers/job/deleteJob'));
jobRouter.patch('/:id', verifyToken, checkObjectID, require('../controllers/job/updateJob'));
jobRouter.get('/:id/applicants', verifyToken, checkObjectID, require('../controllers/job/getApplicants'));
jobRouter.post('/:id/apply', verifyToken, checkObjectID, require('../controllers/job/applyForAJob'));

module.exports = jobRouter;