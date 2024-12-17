import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css'; // Ensure this path is correct and the CSS file exists

function Homepage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user-specific data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome to SoulSpeak</h1>
        <p>Your emotional support platform</p>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Homepage;
