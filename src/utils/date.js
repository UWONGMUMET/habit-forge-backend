import dayjs from "dayjs";

export const now = () => dayjs();

export const todayStart = () =>
    dayjs().startOf("day");

export const todayEnd = () =>
    dayjs().endOf("day");

export const monthStart = () =>
    dayjs().startOf("month");

export const monthEnd = () =>
    dayjs().endOf("month");

export const subtractDays = (days) =>
    dayjs().subtract(days, "day");

export const isSameDay = (date1, date2) =>
    dayjs(date1).isSame(date2, "day");

export const toDate = (dayjsObj) =>
    dayjsObj.toDate();
