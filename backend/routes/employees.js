const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/errorHandler');
const protect = require('../middleware/auth');
const { addEmployee, listEmployees, getEmployee, updateEmployee } = require('../controllers/employeeController');

const employeeValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('aadhaarNumber').matches(/^\d{12}$/).withMessage('Aadhaar must be 12 digits'),
  body('address').notEmpty().withMessage('Address is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('email').isEmail().withMessage('Valid email required'),
  body('mobileNumber').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number required'),
];

router.use(protect);

router.post('/', employeeValidation, validate, addEmployee);
router.get('/', listEmployees);
router.get('/:id', getEmployee);
router.put('/:id', employeeValidation, validate, updateEmployee);

module.exports = router;
