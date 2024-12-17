class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Pass the message to the parent constructor
        this.statusCode = statusCode; // Set the statusCode property
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // Set status based on statusCode
        this.isOperational = true; // Mark the error as operational
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

module.exports = AppError;
