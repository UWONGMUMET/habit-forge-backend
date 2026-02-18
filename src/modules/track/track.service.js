import dayjs from "dayjs";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { todayStart, todayEnd, isSameDay } from "../../utils/date.js";

export const isHabitCheckedToday = async (habitId) => {
    const log = await prisma.habitLog.findFirst({
        where: {
            habitId,
            date: {
                gte: todayStart(),
                lte: todayEnd()
            }
        }
    });

    return !!log;
};

export const checkHabitToday = async (habitId, userId) => {
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

    const alreadyChecked = await isHabitCheckedToday(habitId);

    if (alreadyChecked) {
        throw new AppError({
            message: "Habit already checked today",
            statusCode: 400,
            code: "HABIT_ALREADY_CHECKED"
        });
    }

    return prisma.habitLog.create({
        data: {
            habitId,
            date: new Date()
        }
    });
};

export const getHabitStreak = async (habitId, userId) => {
    const habit = await prisma.habit.findFirst({
        where: { id: Number(habitId), userId }
    });

    if (!habit) {
        throw new AppError({
            message: "Habit not found",
            statusCode: 404,
            code: "HABIT_NOT_FOUND"
        });
    }

    const logs = await prisma.habitLog.findMany({
        where: { habitId: Number(habitId) },
        orderBy: { date: "desc" }
    });

    if (!logs.length) return { streak: 0 };

    let streak = 0;
    let expectedDay = todayStart(); 

    for (const log of logs) {
        const logDay = dayjs(log.date).startOf("day");

        if (logDay.isAfter(expectedDay)) continue;

        if (logDay.isSame(expectedDay)) {
            streak++;
            expectedDay = expectedDay.subtract(1, "day");
            continue;
        }

        const yesterday = expectedDay.subtract(1, "day");
        if (logDay.isSame(yesterday)) {
            streak++;
            expectedDay = yesterday;
            continue;
        }
        break;
    }

    return { streak };
};

export const getHabitStats = async (habitId, userId) => {
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

    const totalLogs = await prisma.habitLog.count({
        where: {
            habitId
        }
    });

    const streak = await getHabitStreak(habitId);
    const checkedToday = await isHabitCheckedToday(habitId);

    return {
        totalLogs,
        streak,
        checkedToday
    };
};