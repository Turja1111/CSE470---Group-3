import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendResetPasswordLink } from '../api';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendResetPasswordLink(email);
      navigate('/otp-verification'); // Redirect to OTP Verification
    } catch (err) {
      setError('Failed to send reset link.');
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
