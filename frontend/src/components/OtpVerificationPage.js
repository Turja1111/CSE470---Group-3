import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../api';
import '../css/OtpVerificationPage.css';  // Updated to reflect the location in the css folder


function OTPVerificationPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(email, otp);
      alert('OTP verified successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h1>Verify OTP</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
  );
}

export default OTPVerificationPage;
