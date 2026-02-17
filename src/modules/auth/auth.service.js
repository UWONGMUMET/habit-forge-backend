import { prisma } from "../../config/prisma.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateAccessToken } from "../../utils/jwt.js";
import { AppError } from "../../utils/AppError.js";

export const registerService = async ({ email, password, role }) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });
    
    if (existingUser) {
        throw new AppError({
            message: "User already exists",
            statusCode: 409,
            code: "EMAIL_EXISTS"
        });
    }
    
    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role || "USER"
        }
    });
    
    return user;
};

export const loginService = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    
    if (!user) {
        throw new AppError({
            message: "User not found",
            statusCode: 404,
            code: "USER_NOT_FOUND"
        });
    }
    
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new AppError({
            message: "Invalid password",
            statusCode: 401,
            code: "INVALID_PASSWORD"
        });
    }
    
    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    return { user, accessToken };
} 
