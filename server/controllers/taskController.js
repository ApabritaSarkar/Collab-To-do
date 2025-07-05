const Task = require('../models/Task');
const User = require('../models/User');
const logAction = require('./logAction');
const ActionLog = require('../models/ActionLog');

// Get recent logs
exports.getRecentLogs = async (req, res) => {
  const logs = await ActionLog.find()
    .sort({ timestamp: -1 })
    .limit(20)
    .populate('user', 'name email')
    .populate('task', 'title');
  res.json(logs);
};

// Get all tasks
exports.getTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'name email');
  res.json(tasks);
};

// Create task
exports.createTask = async (req, res) => {
  const { title, description, status, priority, assignedTo } = req.body;

  const task = new Task({
    title,
    description,
    status,
    priority,
    assignedTo,
    createdBy: req.user._id
  });

  await task.save();
  await logAction(req.user._id, task._id, 'create', `Created task: ${title}`);
  res.status(201).json(task);
};

// Update task
exports.updateTask = async (req, res) => {
  const { updatedAt, ...updateFields } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    // 🛑 Conflict Check
    if (updatedAt && new Date(updatedAt).getTime() !== new Date(task.updatedAt).getTime()) {
      return res.status(409).json({
        message: 'Conflict detected. The task has been modified by another user.',
        currentServerVersion: task
      });
    }

    // ✅ No conflict: update
    Object.assign(task, updateFields);
    await task.save();

    const logAction = require('./logAction');
    await logAction(req.user._id, task._id, 'update', `Updated task: ${task.title}`);

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};


// Delete task
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  await logAction(req.user._id, req.params.id, 'delete', `Deleted a task`);
  res.json({ message: 'Task deleted' });
};

// Smart Assign API
exports.smartAssign = async (req, res) => {
  try {
    // 1. Get all users
    const users = await User.find();

    // 2. Count active (non-Done) tasks for each user
    const taskCounts = await Promise.all(users.map(async user => {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Done' }
      });
      return { user, count };
    }));

    // 3. Find user with fewest tasks
    taskCounts.sort((a, b) => a.count - b.count);
    const leastBusyUser = taskCounts[0].user;

    // 4. Update the task
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: leastBusyUser._id },
      { new: true }
    ).populate('assignedTo', 'name email');

    // 5. Log the action
    const logAction = require('./logAction');
    await logAction(req.user._id, task._id, 'smart-assign', `Smart-assigned task to ${leastBusyUser.name}`);

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Smart assign failed' });
  }
};
