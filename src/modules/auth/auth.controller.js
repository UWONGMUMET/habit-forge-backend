import { registerService, loginService } from "./auth.service.js";
import { AppError } from "../../utils/AppError.js";
import { success } from "../../utils/response.js";

export const registerController = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            throw new AppError({
                message: "Email and password are required",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }
        
        const user = await registerService({ email, password, role });

        return success(res, {
            id: user.id,
            email: user.email,
            role: user.role
        }, "User registered successfully", 201);
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            throw new AppError({
                message: "Email and password are required",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }

        const { user, accessToken } = await loginService({ email, password });

        return success(res, {
            id: user.id,
            email: user.email,
            role: user.role,
            accessToken
        }, "User logged in successfully", 200);
    } catch (error) {
        next(error);
    }
}