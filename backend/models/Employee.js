const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  aadhaarNumber: {
    type: String, required: true, unique: true,
    match: [/^\d{12}$/, 'Aadhaar must be 12 digits']
  },
  address: { type: String, required: true, trim: true },
  salary: { type: Number, required: true, min: 0 },
  email: {
    type: String, required: true, unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  mobileNumber: {
    type: String, required: true,
    match: [/^[6-9]\d{9}$/, 'Invalid Indian mobile number']
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
