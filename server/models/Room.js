const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);