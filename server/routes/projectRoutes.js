const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, addMember, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.route('/:id')
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);

router.post('/:id/members', protect, admin, addMember);

module.exports = router;
