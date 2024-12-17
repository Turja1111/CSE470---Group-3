const mongoose = require('mongoose');
const dotenv = require("dotenv");

// Load environment variables from config.env
dotenv.config({ path: "./config.env" });

// Log the current environment (for debugging)
console.log(`Environment: ${process.env.NODE_ENV}`);

// Initialize Express app
const app = require('./app');

// Get the database URI from environment variables
const db = process.env.DB;
const dbPass = process.env.DB_PASS;

// Ensure the DB URI is defined
if (!db) {
    throw new Error('Database connection string (DB) is not defined in config.env');
}

// Connect to MongoDB
mongoose.connect(db)
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });

// Use process.env.PORT if available, otherwise default to 8000
const port = process.env.PORT || 8000;

// Start the server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
