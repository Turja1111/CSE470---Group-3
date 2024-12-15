const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Route to update user profile
router.put('/update/:id', async (req, res) => {
  const { id } = req.params; // User ID from the URL
  const { username, email, password, phoneNumber, nationality, birthdate } = req.body;

  try {
    // Prepare the update data
    const updateData = {
      username,
      email,
      phoneNumber,
      nationality,
      birthdate,
    };

    // Hash the password if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Find the user by ID and update their details
    const updatedUser = await User.findByIdAndUpdate(id.trim(), updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the inputs
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

module.exports = router;
