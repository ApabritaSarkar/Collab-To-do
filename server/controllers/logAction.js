const ActionLog = require('../models/ActionLog');

const logAction = async (userId, taskId, actionType, message) => {
  try {
    const log = new ActionLog({
      user: userId,
      task: taskId,
      actionType,
      message
    });
    await log.save();
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
};

module.exports = logAction;
