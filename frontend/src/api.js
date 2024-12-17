import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API call for logging in
export const loginUser = (email, password) => {
  return api.post('/users/login', { email, password });
};

// API call for signing up
export const signupUser = (email, password) => {
  return api.post('/users/signup', { email, password });
};

// API call for sending OTP for account verification
export const sendOtp = (email) => {
  return api.post('/auth/send-otp', { email });
};

// API call for verifying OTP
export const verifyOtp = (email, otp) => {
  return api.post('/auth/verify-otp', { email, otp });
};

// API call for resetting the password
export const resetPassword = (email, newPassword) => {
  return api.post('/auth/reset-password', { email, newPassword });
};

// API call for sending the reset password link
export const sendResetPasswordLink = (email) => {
  return api.post('/auth/forgot-password', { email });
};

// API call to submit the total marks for a user
export const submitMarks = async (email, totalMarks) => {
  try {
    return await api
      .patch('/users/update-marks', { email, marks: totalMarks });
  } catch (error) {
    console.error('Error submitting marks:', error.response || error.message);
    throw error; // Optionally rethrow error for handling in the component
  }
};

export default api;
