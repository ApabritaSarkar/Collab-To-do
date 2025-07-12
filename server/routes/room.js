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

    if (!room.members.includes(req.user._id)) {
      room.members.push(req.user._id);
      await room.save();
    }

    res.json({ roomId: room._id, name: room.name });
  } catch (err) {
    res.status(500).json({ message: "Failed to join room" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ name: room.name, code: room.code });
  } catch (err) {
    res.status(500).json({ message: "Failed to get room info" });
  }
});

module.exports = router;
