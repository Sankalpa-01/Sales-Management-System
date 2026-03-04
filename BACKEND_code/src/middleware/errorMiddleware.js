const errorMiddleware = (err, req, res, next) => {
    console.error(err); // Log the error for debugging

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle MySQL errors specifically
    if (err.code === "ER_DUP_ENTRY") {
        statusCode = 400;
        message = "Duplicate entry. The record already exists.";
    } else if (err.code === "ER_BAD_FIELD_ERROR") {
        statusCode = 400;
        message = "Invalid field in database query.";
    } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
        statusCode = 400;
        message = "Foreign key constraint failed.";
    }

    // Handle other custom errors (validation, etc.)
    if (err.name === "ValidationError") {
        statusCode = 422;  // Unprocessable Entity
        message = err.message || "Validation error occurred.";
    }

    // Handle unexpected errors
    if (!err.statusCode) {
        statusCode = 500;
        message = "Something went wrong. Please try again later.";
    }

    // Send the response
    res.status(statusCode).json({ error: message });
};

module.exports = errorMiddleware;
