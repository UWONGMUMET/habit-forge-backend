import { prisma } from "../../utils/prisma.js";
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

export const getHabitStreak = async (habitId) => {
    const logs = await prisma.habitLog.findMany({
        where: {
            habitId
        },
        orderBy: {
            date: "asc"
        }
    });

    if (!logs.length) {
        return 0;
    };

    let streak = 0;
    let currentDay = todayStart();

    for (const log of logs) {
        if (isSameDay(log.date, currentDay)) {
            streak++;

            currentDay = new Date(currentDay);
            currentDay.setDate(currentDay.getDate() - 1);
        } else if (log.date < currentDay) {
            break;
        }
    }

    return streak;
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