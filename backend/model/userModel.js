const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide username"],
        trim: true,
        minlength: 3,
        maxlength: 30,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,  // Store in lowercase
        validate: [validator.isEmail, "Please provide a valid email"],
        index: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false,  // Don't return password in queries
    },
    passwordConfirm: {
        type: String,
        required: function () {
            // Only required when the document is new (during registration)
            return this.isNew;
        },
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Password doesn't match"
        },
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    resetPasswordOtp: {
        type: String,
        default: null,
    },
    resetPasswordOtpExpires: {
        type: Date,
        default: null,
    },
    nationality: {
        type: String,
        required: [true, "Please provide your nationality"],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    birthdate: {
        type: Date,
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    totalMarks: {  // New field to store total marks
        type: Number,
        default: 0,  // Initialize total marks as 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
});

// Apply the plugin to add better unique validation error handling
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // Clear passwordConfirm after hashing
    next();
});

userSchema.methods.correctPassword = async function (password, userPassword) {
    return await bcrypt.compare(password, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
