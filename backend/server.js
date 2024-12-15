const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User'); // Import the User model

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

// Database Connection
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// Function to add a test user
async function addTestUser() {
  const user = new User({
    username: "TestUser", // Added a valid username
    email: "testuser@example.com",
    password: "password123", // Use hashed passwords in production!
    phoneNumber: "1234567890", // Provide a unique phone number
    nationality: "Bangladeshi",
    birthdate: "2000-01-01",
  });

  try {
    const savedUser = await user.save();
    console.log("Test user added:", savedUser);
  } catch (err) {
    console.error("Error adding test user:", err);
  }
}

// Add the test user when the server starts
addTestUser();

// Default Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
