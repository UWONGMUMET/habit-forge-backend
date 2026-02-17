import { createHabit, getHabits, getHabitById, updateHabit, deleteHabit } from "./habits.service.js";
import { AppError } from "../../utils/AppError.js";
import { success } from "../../utils/response.js";

export const createHabitController = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            throw new AppError({
                message: "Name is required",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }

        const habit = await createHabit({
            userId: req.user.id,
            name
        });

        return success(res, habit, "Habit created successfully", 201);
    } catch (error) {
        next(error);
    }
};

export const getHabitsController = async (req, res, next) => {
    try {
        const habits = await getHabits(req.user.id);

        return success(res, habits, "Habits fetched successfully", 200);
    } catch (error) {
        next(error);
    }
};

export const getHabitByIdController = async (req, res, next) => {
    try {
        const habitId = Number(req.params.id);

        if (isNaN(habitId)) {
            throw new AppError({
                message: "Invalid habit id",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }

        const habit = await getHabitById(habitId, req.user.id);

        return success(res, habit, "Habit fetched successfully", 200);
    } catch (error) {
        next(error);
    }
};

export const updateHabitController = async (req, res, next) => {
    try {
        const habitId = Number(req.params.id);
        const { name } = req.body;

        if (isNaN(habitId)) {
            throw new AppError({
                message: "Invalid habit id",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }

        if (!name) {
            throw new AppError({
                message: "Name is required",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }

        const habit = await updateHabit({
            habitId,
            userId: req.user.id,
            data: {
                name
            }
        });

        return success(res, habit, "Habit updated successfully", 200);
    } catch (error) {
        next(error);
    }
};

export const deleteHabitController = async (req, res, next) => {
    try {
        const habitId = Number(req.params.id);

        if (isNaN(habitId)) {
            throw new AppError({
                message: "Invalid habit id",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }

        const result = await deleteHabit(habitId, req.user.id);

        return success(res, result, "Habit deleted successfully", 200);
    } catch (error) {
        next(error);
    }
};