const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getRecentLogs    
} = require('../controllers/taskController');
const { smartAssign } = require('../controllers/taskController');

router.get('/logs/recent', protect, getRecentLogs);
router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.put('/smart-assign/:id', protect, smartAssign);

module.exports = router;
