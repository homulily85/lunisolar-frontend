import { useEffect, useMemo, useRef, useState } from "react";
import type { DayInfo } from "../../type.ts";
import AddEventPopup from "../popup/AddEventPopup.tsx";
import { useAppSelector } from "../../hook.ts";
import Icon from "@mdi/react";
import { mdiCircleSmall } from "@mdi/js";
import {
    isThisEventFinishedAfter,
    isThisEventStartBefore,
    isThisEventStartInTimeRange,
} from "../../utils/events.ts";

const DayCell = ({
    info,
    onSelect,
}: {
    info: DayInfo;
    onSelect: (ts: number) => void;
}) => {
    const { date, ts, lunarText, isToday, isSelected, isCurrentMonth } = info;

    const [open, setOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
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

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!popupRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        <div
            data-date={ts}
            onClick={() => {
                setOpen(true);
                onSelect(ts);
            }}
            className={`relative ${bgClass} justify-items-center rounded-lg py-2 px-4 h-full 
                        ${isSelected ? "" : " hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
            <p className={`text-lg ${textColor}`}>{date.getDate()}</p>
            <p className={`text-sm ${textColor}`}>{lunarText}</p>
            {eventsInCurrentDay > 0 && <Icon path={mdiCircleSmall} size={1} />}
            {open && token && (
                <AddEventPopup popupRef={popupRef} setOpen={setOpen} />
            )}
        </div>
    );
};

export default DayCell;
