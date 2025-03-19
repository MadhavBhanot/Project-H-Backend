const express = require('express');
const storyRouter = express.Router();
const { verifyClerkToken } = require('../middleware/clerk/verifyToken');

// Import controllers
const createStory = require('../controllers/story/createStory');
const getStories = require('../controllers/story/getStories');
const interactWithStory = require('../controllers/story/interactWithStory');

// Protected routes - require authentication
storyRouter.use(verifyClerkToken);

// Story routes - note these are relative to /api/stories
storyRouter.get('/feed', getStories);
storyRouter.post('/create', createStory);
storyRouter.post('/:id/interact', interactWithStory);

// Log the available routes on startup
console.log('📋 Story routes mounted:');
console.log('- GET /api/stories/feed');
console.log('- POST /api/stories/create');
console.log('- POST /api/stories/:id/interact');

module.exports = storyRouter; 