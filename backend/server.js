require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { markDailyAttendance } = require('./controllers/attendanceController');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/attendance', require('./routes/attendance'));

app.get('/', (req, res) => res.json({ message: 'Employee Management API running' }));

// Cron: mark attendance daily at 12:00 AM
cron.schedule('0 0 * * *', () => {
  console.log('Running daily attendance cron...');
  markDailyAttendance();
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
