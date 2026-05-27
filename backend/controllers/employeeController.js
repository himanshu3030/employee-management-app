const Employee = require('../models/Employee');

// POST /api/employees
const addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ message: 'Employee added', employee });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Email or Aadhaar already exists' });
    res.status(500).json({ message: err.message });
  }
};

// GET /api/employees
const listEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', field } = req.query;
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobileNumber: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [employees, total] = await Promise.all([
      Employee.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Employee.countDocuments(query),
    ]);

    res.json({ employees, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/employees/:id
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee updated', employee });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Email or Aadhaar already exists' });
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addEmployee, listEmployees, getEmployee, updateEmployee };
