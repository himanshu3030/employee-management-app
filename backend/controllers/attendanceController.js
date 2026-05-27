const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const getTodayDate = () => new Date().toISOString().split('T')[0];

// PUT /api/attendance/:id  — edit today's attendance only
const updateAttendance = async (req, res) => {
  try {
    const today = getTodayDate();
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (record.date !== today)
      return res.status(403).json({ message: 'Can only edit today\'s attendance' });

    record.status = req.body.status || record.status;
    await record.save();
    res.json({ message: 'Attendance updated', record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/attendance?page&limit&date&employeeId
const listAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 10, date, employeeId } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (date) query.date = date;
    if (employeeId) query.employee = employeeId;

    const [records, total] = await Promise.all([
      Attendance.find(query)
        .populate('employee', 'name email mobileNumber')
        .skip(skip).limit(Number(limit)).sort({ date: -1 }),
      Attendance.countDocuments(query),
    ]);

    res.json({ records, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/attendance/employee/:employeeId  — employee-wise history
const employeeAttendanceHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const { employeeId } = req.params;

    const [records, total] = await Promise.all([
      Attendance.find({ employee: employeeId })
        .skip(skip).limit(Number(limit)).sort({ date: -1 }),
      Attendance.countDocuments({ employee: employeeId }),
    ]);

    res.json({ records, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Internal: mark all employees present (called by cron)
const markDailyAttendance = async () => {
  try {
    const today = getTodayDate();
    const employees = await Employee.find({}, '_id');
    const records = employees.map(emp => ({ employee: emp._id, date: today, status: 'Present' }));

    await Attendance.insertMany(records, { ordered: false }); // skip duplicates
    console.log(`Attendance marked for ${records.length} employees on ${today}`);
  } catch (err) {
    console.error('Cron attendance error:', err.message);
  }
};

module.exports = { updateAttendance, listAttendance, employeeAttendanceHistory, markDailyAttendance };
