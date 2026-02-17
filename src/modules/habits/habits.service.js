import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const createHabit = async ({ userId, name }) => {
    const habit = await prisma.habit.create({
        data: {
            name, 
            userId
        }
    });

    return habit;
};

export const getHabits = async (userId) => {
    const habits = await prisma.habit.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    logs: true
                }
            }
        }
    });

    return habits;
};

export const getHabitById = async (habitId, userId) => {
    const habit = await prisma.habit.findFirst({
        where: {
            id: habitId,
            userId
        },
        include: {
            logs: true
        }
    });

    if (!habit) {
        throw new AppError({
            message: "Habit not found",
            statusCode: 404,
            code: "HABIT_NOT_FOUND"
        });
    }

    return habit;
};

export const updateHabit = async ({ habitId, userId, data }) => {
    const habit = await prisma.habit.findFirst({
        where: {
            id: habitId,
            userId
        }
    });

    if (!habit) {
        throw new AppError({
            message: "Habit not found",
            statusCode: 404,
            code: "HABIT_NOT_FOUND"
        });
    }

    const updatedHabit = await prisma.habit.update({
        where: { id: habitId },
        data,
    });

    return updatedHabit;
};

export const deleteHabit = async (habitId, userId) => {
    const habit = await prisma.habit.findFirst({
        where: {
            id: habitId,
            userId
        }
    });

    if (!habit) {
        throw new AppError({
            message: "Habit not found",
            statusCode: 404,
            code: "HABIT_NOT_FOUND"
        });
    }

    await prisma.habit.delete({
        where: {
            id: habitId
        }
    });

    return null;
};