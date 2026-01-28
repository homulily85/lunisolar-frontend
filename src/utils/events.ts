import { type Event } from "../type.ts";

export const isThisEventFinishedAfter = (event: Event, datetime: Date) => {
    return Number(event.endDateTime) > datetime.getTime();
};

export const isThisEventFinishedBefore = (event: Event, datetime: Date) => {
    return Number(event.endDateTime) < datetime.getTime();
};

export const isThisEventStartBefore = (event: Event, datetime: Date) => {
    return Number(event.startDateTime) < datetime.getTime();
};

export const isThisEventStartInTimeRange = (
    event: Event,
    rangeStart: Date,
    rangeEnd: Date,
) => {
    return (
        Number(event.startDateTime) >= rangeStart.getTime() &&
        Number(event.startDateTime) <= rangeEnd.getTime()
    );
};
