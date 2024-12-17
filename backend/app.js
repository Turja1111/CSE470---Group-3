const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require('./controller/errorController');
const userRouter = require("./routes/userRouters");
const AppError = require('./utils/appError');  // Correct path based on your project structure
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config.env" });

const app = express();

// Use cookie parser middleware
app.use(cookieParser());

// CORS Options
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? "https://yourfrontend.com" : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));

// Use express.json middleware with a size limit
app.use(express.json({ limit: "10kb" }));

// User API routes
app.use('/api/v1/users', userRouter);

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Export the app object for use in other files
module.exports = app;
