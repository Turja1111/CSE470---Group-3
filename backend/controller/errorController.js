module.exports = (error, req, res, next) => {
    // Set the statusCode and status if they aren't already set
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    // Send the error response
    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
    });
};
