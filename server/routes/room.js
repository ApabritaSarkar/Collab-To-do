const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const shortid = require("shortid");

// Create a room
router.post("/create", auth, async (req, res) => {
  const { name } = req.body;
  const code = shortid.generate().toUpperCase();

  try {
    const room = await Room.create({
      name,
      code,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.json({ roomId: room._id, code });
  } catch (err) {
    res.status(500).json({ message: "Failed to create room" });
  }
});

// Join a room
router.post("/join", auth, async (req, res) => {
  const { code } = req.body;

  try {
    const room = await Room.findOne({ code });
    if (!room) return res.status(404).json({ message: "Room not found" });

if (!room.members.some(id => id.toString() === req.user._id.toString())) {
      room.members.push(req.user._id);
      await room.save();
    }

    res.json({ roomId: room._id, name: room.name });
  } catch (err) {
    res.status(500).json({ message: "Failed to join room" });
  }
});

// Get room details and populate members
router.get("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).select("name code");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get room info" });
  }
});

module.exports = router;
