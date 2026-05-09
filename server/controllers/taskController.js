const Task = require('../models/Task');

// @desc Get all my tasks
// @route GET /api/tasks
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find({}).populate('project', 'name').populate('assignee', 'name');
    } else {
      tasks = await Task.find({ assignee: req.user._id }).populate('project', 'name').populate('assignee', 'name');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get tasks for a specific project
const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create task (Admin only)
const createTask = async (req, res) => {
  const { title, description, priority, dueDate, project, assignee } = req.body;
  try {
    const task = await Task.create({
      title, description, priority, dueDate, project, assignee,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update task status or details
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can ONLY update status of their own tasks
    if (req.user.role === 'member') {
      if (task.assignee.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      // Only allow status update
      task.status = req.body.status || task.status;
    } else {
      // Admin can update everything
      Object.assign(task, req.body);
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete task (Admin only)
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getProjectTasks, createTask, updateTask, deleteTask };
