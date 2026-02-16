export const success = (res, data = null, message = "OK", statusCode = 200, meta = null) => {
    return res.status(statusCode).json({
        status: true,
        message,
        data,
        meta,
        timestamp: new Date().toISOString(),
    });
};