import bcrypt from "bcrypt";
import { config } from "../config/config.js";

export const hashPassword = async (plainPassword) => {
    if (!plainPassword) {
        throw new Error("Password is required");
    }

    return bcrypt.hash(plainPassword, config.saltRounds);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword) {
        throw new Error("Password is required");
    }

    return bcrypt.compare(plainPassword, hashedPassword);
};