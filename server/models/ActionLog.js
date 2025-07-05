const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  actionType: { type: String, required: true }, // e.g., create, update, delete
  message: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
