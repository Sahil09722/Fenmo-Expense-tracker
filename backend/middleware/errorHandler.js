/**
 * Async handler wrapper to catch errors in async route handlers
 * Eliminates need for try-catch in every controller function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global error handler middleware
 * Provides consistent error response format
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });

    // Handle Mongoose duplicate key error (idempotency violation)
    if (err.code === 11000) {
        if (err.keyPattern && err.keyPattern.idempotencyKey) {
            return res.status(409).json({
                error: 'Duplicate expense detected',
                message: 'An expense with this idempotency key already exists',
                isDuplicate: true,
            });
        }

        return res.status(409).json({
            error: 'Duplicate entry', message: 'A record with this value already exists',
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            error: 'Validation failed', details: errors,
        });
    }

// Handle Mongoose CastError (invalid ObjectId, etc.)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid data format', message: `Invalid ${err.path}: ${err.value}`,
        });
    }

// Handle JSON parsing errors
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'Invalid JSON', message: 'Request body contains invalid JSON',
        });
    }

// Default server error
    const statusCode = err.status || err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Something went wrong';

    res.status(statusCode).json({
        error: message, ...(process.env.NODE_ENV !== 'production' && {stack: err.stack}),
    });
};

module.exports = {asyncHandler, errorHandler};