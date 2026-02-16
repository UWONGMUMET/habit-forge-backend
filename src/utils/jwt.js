import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    }, 
        config.jwtSecret, 
    {
        expiresIn: config.jwtExp,
        issuer: "habit-forge-backend"
    });
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Token expired");
        }
        if (error.name === "JsonWebTokenError") {
            throw new Error("Invalid token");
        }
        throw error;
    }
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};