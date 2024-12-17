import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import OtpVerificationPage from './components/OtpVerificationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import HomePage from './components/HomePage';
import LoginPage from './components/Loginpage'; 
import QuestionPage from './components/QuestionPage'; // Import the QuestionPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* Added /login path explicitly */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/question" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
