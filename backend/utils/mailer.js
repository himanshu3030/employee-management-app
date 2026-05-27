const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"EMS Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for EMS Login',
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
  });
};

module.exports = sendOTP;