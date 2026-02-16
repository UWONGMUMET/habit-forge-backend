import dayjs from "dayjs";

export const today = ()=> dayjs().startOf("day").toDate();
export const monthStart = ()=> dayjs().startOf("month").toDate();