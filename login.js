
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./userModel'); // Adjust the path if necessary


const router = express.Router();


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Login or password is incorrect' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Login or password is incorrect' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        location: user.location,
        age: user.age,
        preferences: user.preferences,
        isCompanion: user.isCompanion
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
  