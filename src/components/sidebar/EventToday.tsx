import { useAppSelector } from "../../hook.ts";
import {
    isThisEventFinishedAfter,
    isThisEventFinishedBefore,
    isThisEventStartBefore,
    isThisEventStartInTimeRange,
} from "../../utils/events.ts";
import { useMemo } from "react";
import SidebarItem from "./SidebarItem.tsx";

const EventToday = () => {
    const events = useAppSelector((state) => state.events);
    const happeningEvents = useMemo(
        () =>
            events
                .filter(
                    (e) =>
                        isThisEventFinishedAfter(e, new Date()) &&
                        isThisEventStartBefore(e, new Date()),
                )
                .sort(
                    (e1, e2) =>
                        Number(e1.startDateTime) - Number(e2.startDateTime),
                ),
        [events],
    );

    const upcomingEvents = useMemo(() => {
        const startBound = new Date();
        const endBound = new Date();
        endBound.setHours(23, 59, 59, 999);
        return events
            .filter((e) => isThisEventStartInTimeRange(e, startBound, endBound))
            .sort(
                (e1, e2) => Number(e1.startDateTime) - Number(e2.startDateTime),
            );
    }, [events]);

    const pastEvents = useMemo(() => {
        const startBound = new Date();
        startBound.setHours(0, 0, 0, 0);
        const endBound = new Date();
        endBound.setHours(
            endBound.getHours(),
            endBound.getMinutes(),
            endBound.getSeconds() + 1,
        );
        return events
            .filter(
                (e) =>
                    isThisEventStartInTimeRange(e, startBound, endBound) &&
                    isThisEventFinishedBefore(e, endBound),
            )
            .sort(
                (e1, e2) => Number(e1.startDateTime) - Number(e2.startDateTime),
            );
    }, [events]);

    return (
        <>
            {happeningEvents.length === 0 &&
                upcomingEvents.length === 0 &&
                pastEvents.length === 0 && (
                    <p className='my-2'>
                        <em>Không có sự kiện</em>
                    </p>
                )}

            {happeningEvents.length > 0 && (
                <div>
                    <p className='font-bold my-1'>Đang diễn ra</p>
                    {happeningEvents.map((e) => (
                        <SidebarItem key={e.id} e={e} />
                    ))}
                </div>
            )}
            {upcomingEvents.length > 0 && (
                <div>
                    <p className='font-bold my-1'>Sắp tới</p>
                    {upcomingEvents.map((e) => (
                        <SidebarItem key={e.id} e={e} />
                    ))}
                </div>
            )}
            {pastEvents.length > 0 && (
                <div>
                    <p className='font-bold my-1'>Đã qua</p>
                    {pastEvents.map((e) => (
                        <SidebarItem key={e.id} e={e} />
                    ))}
                </div>
            )}
        </>
    );
};

export default EventToday;
