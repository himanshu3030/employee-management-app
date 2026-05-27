const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/errorHandler');
const protect = require('../middleware/auth');
const { updateAttendance, listAttendance, employeeAttendanceHistory } = require('../controllers/attendanceController');

router.use(protect);

router.get('/', listAttendance);
router.get('/employee/:employeeId', employeeAttendanceHistory);
router.put('/:id', [
  body('status').isIn(['Present', 'Absent', 'Leave']).withMessage('Status must be Present, Absent, or Leave'),
], validate, updateAttendance);

router.post('/mark-today', protect, async (req, res) => {
  const { markDailyAttendance } = require('../controllers/attendanceController');
  await markDailyAttendance();
  res.json({ message: 'Attendance marked for today' });
});

module.exports = router;
