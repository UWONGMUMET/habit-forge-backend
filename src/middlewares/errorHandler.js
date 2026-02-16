import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    logger.error({
        message: err.message,
        code: err.code,
        statusCode,
        path: req.originalUrl,
        method: req.method,
        stack: err.stack
    });

    if (err.isOperational) {
        return res.status(statusCode).json({
            status: "fail",
            message: err.message,
            code: err.code,
            details: err.details
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        timestamp: new Date().toISOString()
    });
};