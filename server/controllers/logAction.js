const ActionLog = require('../models/ActionLog');
const Task = require('../models/Task');

const logAction = async (userId, taskId, actionType, message) => {
  try {
    const task = await Task.findById(taskId).select('room');
    if (!task) return;

    const log = new ActionLog({
      user: userId,
      task: taskId,
      room: task.room,
      actionType,
      message,
    });

    await log.save();
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
};

module.exports = logAction;
