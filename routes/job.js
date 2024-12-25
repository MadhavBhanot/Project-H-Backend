// All the job routes
const express = require('express');
const jobRouter = express.Router();
const verifyToken = require('../middleware/auth/verifyToken')

jobRouter.post('/create-job', verifyToken, require('../controllers/job/createJob'));
jobRouter.get('/', verifyToken, require('../controllers/job/getAllJob'));
jobRouter.get('/:id', verifyToken, require('../controllers/job/getJobById'));
jobRouter.delete('/:id', verifyToken, require('../controllers/job/deleteJob'));
// jobRouter.put('/:id', verifyToken, require('../controllers/job/updateJob'));
// jobRouter.post('/:id/apply', require('../controllers/job/applyForAJob'));
// jobRouter.get('/:id/applicants', require('../controllers/job/getApplicants'));

module.exports = jobRouter;