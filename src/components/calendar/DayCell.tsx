import { type MouseEvent, useCallback, useMemo } from "react";
import type { DayInfo } from "../../type.ts";
import { useAppDispatch, useAppSelector } from "../../hook.ts";
import {
    isThisEventFinishedAfter,
    isThisEventStartBefore,
    isThisEventStartInTimeRange,
} from "../../utils/events.ts";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Icon from "@mdi/react";
import { mdiCircleSmall, mdiPlus } from "@mdi/js";
import { setShowAddEventDialog } from "../../reducers/uiReducer.ts";
import { setCurrentSelectedSolarDate } from "../../reducers/dateReducer.ts";

const DayCell = ({ info }: { info: DayInfo }) => {
    const { date, ts, lunarText, isToday, isSelected, isCurrentMonth } = info;
    const dispatch = useAppDispatch();

    const token = useAppSelector((state) => state.user.accessToken);
    const events = useAppSelector((state) => state.events);

    const eventsInCurrentDay = useMemo(() => {
        if (!token) {
            return 0;
        }

        const startBound = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );
        const endBound = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            23,
            59,
            59,
            999,
        );

        return events.reduce((count, e) => {
            const matches =
                isThisEventStartInTimeRange(e, startBound, endBound) ||
                (isThisEventStartBefore(e, startBound) &&
                    isThisEventFinishedAfter(e, startBound));
            return count + (matches ? 1 : 0);
        }, 0);
    }, [date, events, token]);

    const onClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            dispatch(setShowAddEventDialog(true));
        },
        [dispatch],
    );

    const setSelectedDay = useCallback(
        (ts: number) => {
            dispatch(setCurrentSelectedSolarDate(ts));
        },
        [dispatch],
    );

    const bgClass = isSelected
        ? "bg-orange-200 dark:bg-orange-700"
        : "bg-white dark:bg-gray-700";
    const textColor =
        isSelected && isToday
            ? "text-black dark:text-white"
            : isToday
              ? "text-orange-800 dark:text-orange-300"
              : isCurrentMonth
                ? "text-black dark:text-white"
                : "text-gray-500 dark:text-gray-400";

    return (
        <Popover className='relative h-full'>
            <PopoverButton
                onClick={() => setSelectedDay(ts)}
                data-date={ts}
                className={`${bgClass} flex flex-col justify-start items-center rounded-lg py-2 px-4 h-full w-full focus:outline-none ${isSelected ? "" : " hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
                <p className={`text-lg ${textColor}`}>{date.getDate()}</p>
                <p className={`text-sm ${textColor}`}>{lunarText}</p>
                {eventsInCurrentDay > 0 && (
                    <Icon path={mdiCircleSmall} size={1} />
                )}
            </PopoverButton>
            {token && (
                <PopoverPanel
                    anchor={"right"}
                    className={`bg-white hover:cursor-pointer hover:bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-600 rounded shadow dark:text-white`}>
                    <button className='w-full h-full p-3' onClick={onClick}>
                        <Icon path={mdiPlus} size={1} className='inline pb-1' />
                        Thêm sự kiện
                    </button>
                </PopoverPanel>
            )}
        </Popover>
    );
};

export default DayCell;
