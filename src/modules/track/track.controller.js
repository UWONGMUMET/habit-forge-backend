import { AppError } from "../../utils/AppError.js";
import { success } from "../../utils/response.js";
import { checkHabitToday } from "./track.service.js";

export const checkHabitController = async (req, res, next) => {
    try {
        const habitId = req.params.id;

        if (!habitId) {
            throw new AppError({
                message: "Habit ID is required",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        };

        await checkHabitToday(habitId, req.user.id);

        return success(res, null, "Habit checked successfully", 201);
    } catch (error) {
        next(error);
    }
};

export const getHabitsStreakController = async (req, res, next) => {
    try {
        const habitId = Number(req.params.id);
        if (isNaN(habitId)) {
            throw new AppError({
                message: "Invalid habit ID",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }

        const streak = await getHabitStreak(habitId, req.user.id);

        return success(res, streak, "Habit streak retrieved successfully", 200);
    } catch (error) {
        next(error);
    }
};

export const getHabitStatsController = async (req, res, next) => {
    try {
        const habitId = Number(req.params.id);
        if (isNaN(habitId)) {
            throw new AppError({
                message: "Invalid habit ID",
                statusCode: 400,
                code: "BAD_REQUEST"
            });
        }

        const stats = await getHabitStats(habitId, req.user.id);

        return success(res, stats, "Habit stats retrieved successfully", 200);
    } catch (error) {
        next(error);
    }
}