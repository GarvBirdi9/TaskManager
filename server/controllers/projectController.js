const Project = require('../models/Project');
const User = require('../models/User');

// @desc Get my projects
// @route GET /api/projects
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({}).populate('owner', 'name').populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('owner', 'name').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create project (Admin only)
// @route POST /api/projects
const createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id] // Admin is always a member
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update project (Admin only)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add member to project (Admin only)
const addMember = async (req, res) => {
  const { email } = req.body;
  try {
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    const project = await Project.findById(req.params.id);
    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User already in project' });
    }

    project.members.push(userToAdd._id);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete project (Admin only)
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject, updateProject, addMember, deleteProject };
