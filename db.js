// Import mongoose to interact with MongoDB
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  location: String,
  age: Number,
  preferences: [String],
  isCompanion: Boolean
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Insert 10 users into the database
const seedUsers = async () => {
  const users = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      username: 'alicej',
      password: 'password123',
      location: 'New York, USA',
      age: 28,
      preferences: ['reading', 'traveling'],
      isCompanion: false
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      username: 'bobsmith',
      password: 'password123',
      location: 'London, UK',
      age: 35,
      preferences: ['sports', 'cooking'],
      isCompanion: true
    },
    {
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      username: 'charlied',
      password: 'password123',
      location: 'Sydney, Australia',
      age: 30,
      preferences: ['gaming', 'hiking'],
      isCompanion: false
    },
    {
      name: 'Diana Ross',
      email: 'diana@example.com',
      username: 'dianar',
      password: 'password123',
      location: 'Toronto, Canada',
      age: 27,
      preferences: ['music', 'art'],
      isCompanion: true
    },
    {
      name: 'Evan White',
      email: 'evan@example.com',
      username: 'evanw',
      password: 'password123',
      location: 'Dublin, Ireland',
      age: 40,
      preferences: ['writing', 'gardening'],
      isCompanion: false
    },
    {
      name: 'Fiona Green',
      email: 'fiona@example.com',
      username: 'fionag',
      password: 'password123',
      location: 'Berlin, Germany',
      age: 33,
      preferences: ['photography', 'yoga'],
      isCompanion: true
    },
    {
      name: 'George Hall',
      email: 'george@example.com',
      username: 'georgeh',
      password: 'password123',
      location: 'Rome, Italy',
      age: 29,
      preferences: ['cycling', 'history'],
      isCompanion: false
    },
    {
      name: 'Hannah Brown',
      email: 'hannah@example.com',
      username: 'hannahb',
      password: 'password123',
      location: 'Paris, France',
      age: 25,
      preferences: ['fashion', 'movies'],
      isCompanion: true
    },
    {
      name: 'Ian Black',
      email: 'ian@example.com',
      username: 'ianb',
      password: 'password123',
      location: 'Madrid, Spain',
      age: 37,
      preferences: ['fitness', 'technology'],
      isCompanion: false
    },
    {
      name: 'Jane Wilson',
      email: 'jane@example.com',
      username: 'janew',
      password: 'password123',
      location: 'Tokyo, Japan',
      age: 32,
      preferences: ['anime', 'cooking'],
      isCompanion: true
    }
  ];

  try {
    await User.insertMany(users);
    console.log('Users added successfully!');
  } catch (error) {
    console.error('Error inserting users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedUsers();
