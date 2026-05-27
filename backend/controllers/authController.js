const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const sendOTP = require('../utils/mailer');

// Store OTPs temporarily in memory { email: { otp, expiresAt } }
const otpStore = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// STEP 1 — POST /api/auth/login  → verify password, send OTP
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const otp = generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 min

    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// STEP 2 — POST /api/auth/verify-otp  → verify OTP, return tokens
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: 'OTP not requested' });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  delete otpStore[email]; // clear after use

  const admin = await Admin.findOne({ email });
  const accessToken = generateAccessToken(admin._id);
  const refreshToken = generateRefreshToken(admin._id);

  res.json({ accessToken, refreshToken, message: 'Login successful' });
};

// POST /api/auth/refresh
const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// GET /api/auth/dashboard
const dashboard = (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
};

module.exports = { login, verifyOTP, refreshToken, dashboard };