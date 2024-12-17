const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const AppError = require('../utils/appError');

const isAuthenticated = catchAsync(async (req, res, next) => {
    // Get token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new AppError('You are not logged in. Please login to access', 401));
    }

    // Verify the token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new AppError('Invalid or expired token', 401));
    }

    // Find the user by the decoded token id
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does not exist', 401));
    }

    // Attach the user to the request object
    req.user = currentUser;

    next();
});

module.exports = isAuthenticated;
