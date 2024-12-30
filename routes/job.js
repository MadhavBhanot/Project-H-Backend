const express = require('express');
const jobRouter = express.Router();
const verifyToken = require('../middleware/auth/verifyToken')
const checkObjectID = require('../middleware/main/checkObjectID')
const upload = require('../utils/main/imageUploading');

jobRouter.use(verifyToken)
jobRouter.post('/create-job', upload.single('imageURL'), require('../controllers/job/createJob'));
jobRouter.get('/', require('../controllers/job/getAllJob'));

jobRouter.use(checkObjectID)
jobRouter.get('/:id', require('../controllers/job/getJobById'));
jobRouter.delete('/:id', require('../controllers/job/deleteJob'));
jobRouter.patch('/:id', require('../controllers/job/updateJob'));
jobRouter.get('/:id/applicants', require('../controllers/job/getApplicants'));
jobRouter.post('/:id/apply', require('../controllers/job/applyForAJob'));

module.exports = jobRouter;