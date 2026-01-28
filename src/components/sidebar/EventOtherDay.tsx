import { useAppSelector } from "../../hook.ts";
import {
    isThisEventFinishedAfter,
    isThisEventStartBefore,
    isThisEventStartInTimeRange,
} from "../../utils/events.ts";
import { useMemo } from "react";
import SidebarItem from "./SidebarItem.tsx";

const EventOtherDay = ({ date }: { date: Date }) => {
    const events = useAppSelector((state) => state.events);
    const eventsInCurrentDay = useMemo(() => {
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
        return events
            .filter(
                (e) =>
                    isThisEventStartInTimeRange(e, startBound, endBound) ||
                    (isThisEventStartBefore(e, startBound) &&
                        isThisEventFinishedAfter(e, startBound)),
            )
            .sort(
                (e1, e2) => Number(e1.startDateTime) - Number(e2.startDateTime),
            );
    }, [date, events]);

    return (
        <>
            {eventsInCurrentDay.length === 0 && (
                <p className='my-2'>
                    <em>Không có sự kiện</em>
                </p>
            )}

            {eventsInCurrentDay.length > 0 && (
                <div>
                    {eventsInCurrentDay.map((e) => (
                        <SidebarItem key={e.id} e={e} />
                    ))}
                </div>
            )}
        </>
    );
};

export default EventOtherDay;
