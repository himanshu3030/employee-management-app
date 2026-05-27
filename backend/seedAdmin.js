require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) { console.log('Admin already exists'); process.exit(); }

  await Admin.create({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  console.log('Admin seeded:', process.env.ADMIN_EMAIL);
  process.exit();
};

seed().catch(console.error);
