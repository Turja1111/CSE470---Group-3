const express = require("express");
const {
  signup,
  verifyAccount,
  resendOTP,
  login,
  logout,
  forgetPassword,
  resetPassword,
  updateMarksByEmail, // Corrected to use the correct function
} = require('../controller/authController');

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Verify account route
router.post('/verify', verifyAccount);

// Resend OTP route
router.post('/resend-otp', resendOTP);

// Login route
router.post("/login", login);

// Logout route
router.post('/logout', logout);

// Forget password route
router.post('/forget-password', forgetPassword);

// Reset password route
router.post('/reset-password', resetPassword);

// Route to update marks by email
router.patch('/update-marks', updateMarksByEmail);

module.exports = router;
