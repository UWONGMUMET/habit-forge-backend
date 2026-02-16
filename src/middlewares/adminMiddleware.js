import { AppError } from "../utils/AppError.js";

export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return next(new AppError({
            message: "Unauthorized",
            statusCode: 401,
            code: "UNAUTHORIZED"
        }));
    }

    if (req.user.role !== "ADMIN") {
        return next(new AppError({
            message: "Admin only",
            statusCode: 403,
            code: "FORBIDDEN"
        }));
    }
    next();
}