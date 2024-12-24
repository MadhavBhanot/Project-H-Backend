// All the job routes
const express = require('express');
const jobRouter = express.Router();
const verifyToken = require('../middleware/auth/verifyToken')

jobRouter.post('/', verifyToken, require('../controllers/job/createJob'));
// jobRouter.get('/', require('../controllers/job/getAllJob'));
// jobRouter.get('/:id', require('../controllers/job/getJobById'));
// jobRouter.put('/:id', require('../controllers/job/updateJob'));
// jobRouter.delete('/:id', require('../controllers/job/deleteJob'));
// jobRouter.post('/:id/apply', require('../controllers/job/applyForAJob'));
// jobRouter.get('/:id/applicants', require('../controllers/job/getApplicants'));

module.exports = jobRouter;