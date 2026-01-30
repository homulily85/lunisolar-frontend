import { useCallback, useEffect, useMemo, type WheelEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hook.ts";
import { LunarCalendar } from "@dqcai/vn-lunar";
import { setCurrentSelectedSolarDate } from "../../reducers/dateReducer.ts";
import type { DayInfo } from "../../type.ts";
import DayCell from "./DayCell.tsx";
import { getEvents } from "../../services/eventService.ts";
import { toast } from "react-toastify";
import { setEvents } from "../../reducers/eventsReducer.ts";

import { isSameDate } from "../../utils/misc.ts";

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

const Calendar = () => {
    const todayTs = useAppSelector((s) => s.date.today);
    const selectedTs = useAppSelector((s) => s.date.currentSelectedSolarDate);
    const accessToken = useAppSelector((s) => s.user.accessToken);
    const dispatch = useAppDispatch();

    const today = useMemo(() => new Date(todayTs), [todayTs]);
    const selectedDate = useMemo(() => new Date(selectedTs), [selectedTs]);

    const firstDayOfSelectedMonth = useMemo(
        () =>
            new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                1,
                0,
                0,
                0,
                0,
            ),
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

    const changeMonth = useCallback(
        (delta: number) => {
            const d = new Date(selectedTs);
            d.setMonth(d.getMonth() + delta);
            dispatch(setCurrentSelectedSolarDate(d.getTime()));
        },
        [dispatch, selectedTs],
    );

    const onWheel = useCallback(
        (e: WheelEvent<HTMLDivElement>) => {
            if (e.deltaY > 0) {
                changeMonth(1);
            } else {
                changeMonth(-1);
            }
        },
        [changeMonth],
    );

    useEffect(() => {
        if (!accessToken) {
            return;
        }
        (async () => {
            try {
                const events = await getEvents(
                    new Date(
                        firstDayOfSelectedMonth.getFullYear(),
                        firstDayOfSelectedMonth.getMonth() - 1,
                        15,
                    ),
                    new Date(
                        firstDayOfSelectedMonth.getFullYear(),
                        firstDayOfSelectedMonth.getMonth() + 1,
                        15,
                    ),
                );
                dispatch(setEvents(events));
            } catch (e) {
                console.log(e);
                toast.error("Có lỗi xảy ra!");
            }
        })();
    }, [accessToken, dispatch, firstDayOfSelectedMonth]);

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
                <DayCell info={info} key={info.key} />
            ))}
        </div>
    );
};

export default Calendar;
