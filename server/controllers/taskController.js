const Task = require('../models/Task');
const User = require('../models/User');
const logAction = require('./logAction');
const ActionLog = require('../models/ActionLog');

// ──────────────────────── Get Recent Logs ────────────────────────
exports.getRecentLogs = async (req, res) => {
  const logs = await ActionLog.find()
    .sort({ timestamp: -1 })
    .limit(20)
    .populate('user', 'name email')
    .populate('task', 'title');
  res.json(logs);
};

// ──────────────────────── Get All Tasks (by room) ────────────────────────
exports.getTasksByRoom = async (req, res) => {
  try {
    const tasks = await Task.find({ room: req.params.roomId })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks by room' });
  }
};

exports.getTasks = async (req, res) => {
  const { roomId } = req.query;
  if (!roomId) return res.status(400).json({ message: "roomId is required" });

  const tasks = await Task.find({ room: roomId })
    .populate('assignedTo', 'name email')
    .sort({ updatedAt: -1 });

  res.json(tasks);
};

// ──────────────────────── Create Task ────────────────────────
exports.createTask = async (req, res) => {
  const { title, description, priority, assignedTo, roomId } = req.body;
  if (!roomId) return res.status(400).json({ message: "roomId is required" });

  const task = new Task({
    title,
    description,
    priority,
    assignedTo,
    room: roomId,
    createdBy: req.user._id
  });

  await task.save();
  await logAction(req.user._id, task._id, 'create', `Created task: ${title}`);
  res.status(201).json(task);
};

// ──────────────────────── Update Task ────────────────────────
exports.updateTask = async (req, res) => {
  const { updatedAt, ...updateFields } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Conflict detection
    if (updatedAt && new Date(updatedAt).getTime() !== new Date(task.updatedAt).getTime()) {
      return res.status(409).json({
        message: 'Conflict detected. The task has been modified by another user.',
        currentServerVersion: task
      });
    }

    Object.assign(task, updateFields);
    await task.save();

    await logAction(req.user._id, task._id, 'update', `Updated task: ${task.title}`);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// ──────────────────────── Delete Task ────────────────────────
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  await logAction(req.user._id, req.params.id, 'delete', `Deleted a task`);
  res.json({ message: 'Task deleted' });
};

// ──────────────────────── Smart Assign ────────────────────────
exports.smartAssign = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const roomId = task.room;
    if (!roomId) return res.status(400).json({ message: "Room not associated with task" });

    // Get all users in this room
    const room = await require('../models/Room').findById(roomId).populate('members');
    const members = room.members;

    // Count active tasks for each user
    const taskCounts = await Promise.all(members.map(async user => {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        room: roomId,
        status: { $ne: 'Done' }
      });
      return { user, count };
    }));

    // Choose least busy user
    taskCounts.sort((a, b) => a.count - b.count);
    const leastBusyUser = taskCounts[0].user;

    // Update the task
    task.assignedTo = leastBusyUser._id;
    await task.save();
    await task.populate('assignedTo', 'name email');

    await logAction(req.user._id, task._id, 'smart-assign', `Smart-assigned task to ${leastBusyUser.name}`);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Smart assign failed' });
  }
};
