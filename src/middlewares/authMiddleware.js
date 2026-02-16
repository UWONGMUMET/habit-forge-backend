import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { prisma } from "./prisma.js";
import { AppError } from "../utils/AppError.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError({
                message: "Authentication token missing",
                statusCode: 401,
                code: "TOKEN_MISSING"
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwtSecret);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new AppError({
                    message: "Token expired",
                    statusCode: 401,
                    code: "TOKEN_EXPIRED"
                });
            }
            if (error.name === "JsonWebTokenError") {
                throw new AppError({
                    message: "Invalid token",
                    statusCode: 401,
                    code: "INVALID_TOKEN"
                });
            }
            throw error;
        };

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user) {
            throw new AppError({
                message: "User not found",
                statusCode: 404,
                code: "USER_NOT_FOUND"
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        next();
    } catch (error) {
        next(error);
    }
}