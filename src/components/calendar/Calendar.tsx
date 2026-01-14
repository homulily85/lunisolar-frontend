import React, { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hook.ts";
import { LunarCalendar } from "@dqcai/vn-lunar";
import { setCurrentSelectedSolarDate } from "../../reducers/dateReducer.ts";
import type { DayInfo } from "../../type.ts";
import DayCell from "./DayCell.tsx";

const WEEK_DAYS = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const Calendar = () => {
    const todayTs = useAppSelector((s) => s.date.today);
    const selectedTs = useAppSelector((s) => s.date.currentSelectedSolarDate);
    const dispatch = useAppDispatch();

    const today = useMemo(() => new Date(todayTs), [todayTs]);
    const selectedDate = useMemo(() => new Date(selectedTs), [selectedTs]);

    const firstDayOfSelectedMonth = useMemo(
        () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
        [selectedDate],
    );

    const daysInfo = useMemo<DayInfo[]>(() => {
        const arr: DayInfo[] = [];
        const offset = firstDayOfSelectedMonth.getDay();
        const baseTime = firstDayOfSelectedMonth.getTime();

        for (let i = 0; i < 42; i++) {
            const date = new Date(baseTime + (i - offset) * MS_PER_DAY);
            const ts = date.getTime();
            const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            const lunar = LunarCalendar.fromSolar(
                date.getDate(),
                date.getMonth() + 1,
                date.getFullYear(),
            ).lunarDate;
            const lunarText =
                lunar.day === 1 || isSameDate(date, firstDayOfSelectedMonth)
                    ? `${lunar.day}/${lunar.month}`
                    : `${lunar.day}`;

            arr.push({
                date,
                ts,
                key,
                lunarText,
                isToday: isSameDate(date, today),
                isSelected: isSameDate(date, selectedDate),
                isCurrentMonth: date.getMonth() === selectedDate.getMonth(),
            });
        }

        return arr;
    }, [firstDayOfSelectedMonth, today, selectedDate]);

    const setSelectedDay = useCallback(
        (ts: number) => {
            dispatch(setCurrentSelectedSolarDate(ts));
        },
        [dispatch],
    );

    const changeMonth = useCallback(
        (delta: number) => {
            const d = new Date(selectedTs);
            d.setMonth(d.getMonth() + delta);
            dispatch(setCurrentSelectedSolarDate(d.getTime()));
        },
        [dispatch, selectedTs],
    );

    const onWheel = useCallback(
        (e: React.WheelEvent<HTMLDivElement>) => {
            if (e.deltaY > 0) {
                changeMonth(1);
            } else {
                changeMonth(-1);
            }
        },
        [changeMonth],
    );

    return (
        <div
            onWheel={onWheel}
            className='bg-gray-200 grid grid-cols-7 grid-rows-[auto_repeat(6,1fr)] gap-2 p-4 h-full w-full overflow-auto dark:bg-gray-800 dark:text-white'>
            {WEEK_DAYS.map((d) => (
                <div
                    key={d}
                    className='bg-white justify-items-center rounded-lg py-2 px-4 dark:bg-gray-700'>
                    <p className='font-bold text-lg '>{d}</p>
                </div>
            ))}

            {daysInfo.map((info) => (
                <div key={info.key}>
                    <DayCell info={info} onSelect={setSelectedDay} />
                </div>
            ))}
        </div>
    );
};

export default Calendar;
