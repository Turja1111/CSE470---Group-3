import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { resetPassword } from '../api';
import '../css/ResetPasswordPage.Css'; // Ensure the file name is correct

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  const email = location.state?.email; // Get email from location state

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email, password); // Call the resetPassword function
      alert('Password reset successful! Please log in.');
      navigate('/login'); // Navigate to the login page after reset
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h1>Reset Password</h1>
        {error && <p className="error">{error}</p>} {/* Display error message */}
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
