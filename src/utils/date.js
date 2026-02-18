import dayjs from "dayjs";

export const now = () => new Date();

export const todayStart = () =>
    dayjs().startOf("day").toDate();

export const todayEnd = () =>
    dayjs().endOf("day").toDate();

export const monthStart = () =>
    dayjs().startOf("month").toDate();

export const monthEnd = () =>
    dayjs().endOf("month").toDate();

export const subtractDays = (days) =>
    dayjs().subtract(days, "day").toDate();

export const isSameDay = (date1, date2) =>
    dayjs(date1).isSame(date2, "day");