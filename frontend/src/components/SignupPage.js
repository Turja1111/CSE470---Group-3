import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/SignupPage.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    nationality: '',
    birthdate: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    // Validate email format (basic check)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      // Send data to the backend using the correct API endpoint
      const response = await axios.post('http://localhost:8000/api/v1/users/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle success response
      setMessage(response.data.message);
      setError('');

      // Store the email in localStorage for use in QuestionPage
      localStorage.setItem('email', formData.email);

      // Redirect to the question page after successful signup
      navigate('/question');
    } catch (err) {
      // Handle error response
      setError(err.response ? err.response.data.message : 'Error occurred during signup');
      setMessage('');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nationality"
          placeholder="Nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birthdate"
          placeholder="Birthdate"
          value={formData.birthdate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
