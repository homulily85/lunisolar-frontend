import { useMemo } from "react";
import { useAppSelector } from "../../hook.ts";
import {
    isThisEventFinishedAfter,
    isThisEventFinishedBefore,
    isThisEventStartBefore,
    isThisEventStartInTimeRange,
} from "../../utils/events.ts";
import EventItem from "./EventItem.tsx";

const EventList = ({ date }: { date: Date }) => {
    const events = useAppSelector((state) => state.events);

    const isToday = useMemo(() => {
        return date.toDateString() === new Date().toDateString();
    }, [date]);

    const eventsInDay = useMemo(() => {
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

    const categories = useMemo(() => {
        if (!isToday) return null;

        const now = new Date();

        return {
            happening: eventsInDay.filter(
                (e) =>
                    isThisEventFinishedAfter(e, now) &&
                    isThisEventStartBefore(e, now),
            ),
            upcoming: eventsInDay.filter((e) =>
                isThisEventStartInTimeRange(
                    e,
                    now,
                    new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        23,
                        59,
                        59,
                        999,
                    ),
                ),
            ),
            past: eventsInDay.filter((e) => isThisEventFinishedBefore(e, now)),
        };
    }, [isToday, eventsInDay, date]);

    if (eventsInDay.length === 0) {
        return (
            <p className='my-2'>
                <em>Không có sự kiện</em>
            </p>
        );
    }

    if (isToday && categories) {
        return (
            <>
                {categories.happening.length > 0 && (
                    <div>
                        <p className='font-bold my-1'>Đang diễn ra</p>
                        {categories.happening.map((e) => (
                            <EventItem key={e.id} event={e} />
                        ))}
                    </div>
                )}
                {categories.upcoming.length > 0 && (
                    <div>
                        <p className='font-bold my-1'>Sắp tới</p>
                        {categories.upcoming.map((e) => (
                            <EventItem key={e.id} event={e} />
                        ))}
                    </div>
                )}
                {categories.past.length > 0 && (
                    <div>
                        <p className='font-bold my-1'>Đã qua</p>
                        {categories.past.map((e) => (
                            <EventItem key={e.id} event={e} />
                        ))}
                    </div>
                )}
            </>
        );
    }

    return (
        <div>
            {eventsInDay.map((e) => (
                <EventItem key={e.id} event={e} />
            ))}
        </div>
    );
};

export default EventList;
