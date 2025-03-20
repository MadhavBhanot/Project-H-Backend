const express = require('express')
const jobRouter = express.Router()
const { verifyClerkToken } = require('../middleware/clerk/verifyToken.js')
const upload = require('../utils/main/imageUploading')

jobRouter.use(verifyClerkToken)

jobRouter.get('/search', require('../controllers/job/searchJobWithTag'))

jobRouter.post(
  '/create-job',
  upload.single('imageURL'),
  require('../controllers/job/createJob'),
)
jobRouter.get('/', require('../controllers/job/getAllJob'))

jobRouter.get('/:id', require('../controllers/job/getJobById'))
jobRouter.delete('/:id', require('../controllers/job/deleteJob'))
jobRouter.patch('/:id', require('../controllers/job/updateJob'))
jobRouter.post('/:id', require('../controllers/job/applyForAJob'))
jobRouter.get(
  '/applicants/:id',
  require('../controllers/job/getAllApplicantsForAJob.js'),
)
jobRouter.patch(
  '/toggleSave/:id',
  require('../controllers/job/saveOrUnsaveAJob.js'),
)

module.exports = jobRouter
