const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getTasksByRoom,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getLogsByRoom,
  smartAssign,
} = require('../controllers/taskController');

router.get('/logs', protect, getLogsByRoom);
router.get('/room/:roomId', protect, getTasksByRoom);
router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.put('/smart-assign/:id', protect, smartAssign);

module.exports = router;
