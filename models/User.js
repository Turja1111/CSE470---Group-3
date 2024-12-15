const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'], // Custom validation message
    trim: true, // Removes unnecessary spaces
  },
  email: {
    type: String,
    required: [true, 'Email is required'], // Custom validation message
    unique: true,
    lowercase: true, // Converts email to lowercase
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Regex for email validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'], // Minimum length validation
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number'], // Validates 10-15 digit numbers
  },
  nationality: {
    type: String,
    trim: true,
  },
  birthdate: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  resetPasswordOtp: {
    type: String,
  },
  resetPasswordOtpExpires: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
