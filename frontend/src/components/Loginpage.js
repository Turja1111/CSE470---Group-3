import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api'; // API call to backend
import '../css/LoginPage.css'; // Your custom CSS

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect logged-in users to /home if they already have a token
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home'); // Redirect to Home if token exists
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(email, password); // Call backend login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Save token to localStorage
        navigate('/home'); // Redirect to homepage
      }
    } catch (err) {
      setLoading(false);
      setError(err.response ? err.response.data.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
        </p>
        <p>
          <span onClick={() => navigate('/forgot-password')}>Forgot password?</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
