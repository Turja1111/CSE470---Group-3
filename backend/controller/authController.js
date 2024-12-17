const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user._id);

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax'
    };

    res.cookie('token', token, cookieOption);

    user.password = undefined;
    user.passwordConfirm = undefined;
    user.otp = undefined;

    res.status(statusCode).json({
        status: 'success',
        message,
        token,
        data: { user }
    });
};

// Signup Controller
exports.signup = catchAsync(async (req, res, next) => {
    const { email, password, passwordConfirm, username, nationality, birthdate, phoneNumber } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError('Email already registered', 400));

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 24 hours

    // Create a new user
    let newUser;
    try {
        newUser = await User.create({
            username,
            email,
            password,
            passwordConfirm,
            otp,
            otpExpires,
            nationality,
            birthdate,
            phoneNumber
        });
    } catch (error) {
        return next(new AppError('There was an error creating the user. Please try again.', 500));
    }

    console.log('New User Created:', newUser);

    try {
        // Send OTP email
        console.log('Sending OTP email to:', newUser.email);
        await sendEmail({
            email: newUser.email,
            subject: "OTP for email verification",
            html: `<h1>Your OTP is: ${otp}</h1>`
        });
        console.log('Email sent successfully.');

        // Send token and user data in response
        createSendToken(newUser, 200, res, "Registration Successful");

    } catch (error) {
        console.error('Error sending email:', error);
        // If error occurs while sending email, delete the user and return error
        await User.findByIdAndDelete(newUser.id);
        return next(new AppError("There was an error sending the email. Please try again.", 500));
    }
});

// OTP Verification Controller
exports.verifyAccount = catchAsync(async (req, res, next) => {
    const { otp } = req.body;

    if (!otp) {
        return next(new AppError("OTP is missing", 400));
    }

    const user = req.user;

    console.log('User OTP:', user.otp, 'Received OTP:', otp);

    // Check OTP validity
    if (String(user.otp) !== String(otp)) {
        return next(new AppError('Invalid OTP', 400));
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpires) {
        return next(new AppError('OTP has expired. Please request a new OTP', 400));
    }

    // Mark the user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    // Save the user without validation (since OTP should not be validated again)
    await user.save({ validateBeforeSave: false });

    // Send token and user data in response
    createSendToken(user, 200, res, "Email has been verified");
});

// Resend OTP Controller
exports.resendOTP = catchAsync(async(req, res, next) => {
    const { email } = req.user;

    if (!email) {
        return next(new AppError('Email is required to resend OTP', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
        return next(new AppError('This account is already verified', 400));
    }

    const newOtp = generateOtp();
    user.otp = newOtp;
    user.otpExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    try {
        await sendEmail({
            email: user.email,
            subject: 'Resend otp for email verification',
            html: `<h1>Your new OTP is : ${newOtp}</h1>`
        });

        res.status(200).json({
            status: 'success',
            message: 'A new OTP has been sent to your email'
        });

    } catch (error) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email! Please try again', 500));
    }
});

// Login Controller
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return next(new AppError('Please provide a valid email', 400));
    }

    // Find user and verify password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401));
    }

    // Send response with token
    createSendToken(user, 200, res, "Login successful");
});

// Logout Controller
exports.logout = catchAsync(async (req, res, next) => {
    res.cookie("token", "Logged out", {
        expires: new Date(Date.now() - 1000), // Expire the token immediately
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
        status: "Success",
        message: "Logged out successfully"
    });
});


// Forget Password Controller
exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, return an error
    if (!user) {
        return next(new AppError("No user found with this email", 404));
    }

    // Generate a new OTP
    const otp = generateOtp();
    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    // Update user with the OTP and expiry time
    await User.findOneAndUpdate(
        { email },
        { resetPasswordOtp: otp, resetPasswordOtpExpires: otpExpires },
        { new: true }
    );

    // Try sending OTP email
    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset OTP (Valid for 5 minutes)",
            html: `<h1>Your password reset OTP: ${otp}</h1>`
        });

        // Send success response
        res.status(200).json({
            status: "Success",
            message: "Password reset OTP has been sent to your email",
        });
    } catch (error) {
        // If there was an error, clear the OTP fields
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Please try again later', 500));
    }
});

// Reset Password Controller
exports.resetPassword = catchAsync(async (req, res, next) => {
    const { email, otp, password, passwordConfirm } = req.body;

    const user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordOtpExpires: { $gt: new Date() },  // Compare against current Date object
    });

    if (!user) {
        console.log("No user found or OTP expired");
        return next(new AppError("No user found or OTP expired", 400));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;

    await user.save();

    createSendToken(user, 200, res, "Password reset successfully");
});





// Marks Update Controller
exports.updateMarksByEmail = catchAsync(async (req, res) => {
    const { email, marks } = req.body;

    // Validate if marks is a valid number
    if (isNaN(marks) || marks === null || marks === undefined) {
        return res.status(400).json({ message: 'Invalid marks value' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add marks to the existing totalMarks
        user.totalMarks += marks;

        // Save the updated user document
        await user.save();

        // Send the updated totalMarks back to the frontend
        return res.status(200).json({ message: 'Marks updated successfully', totalMarks: user.totalMarks });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update marks', error: error.message });
    }
});

