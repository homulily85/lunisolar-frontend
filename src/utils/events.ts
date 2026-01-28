import { type EventFromServer } from "../type.ts";

export const isThisEventFinishedAfter = (
    event: EventFromServer,
    datetime: Date,
) => {
    return event.endDateTime > datetime.getTime();
};

export const isThisEventFinishedBefore = (
    event: EventFromServer,
    datetime: Date,
) => {
    return event.endDateTime < datetime.getTime();
};

export const isThisEventStartBefore = (
    event: EventFromServer,
    datetime: Date,
) => {
    return event.startDateTime < datetime.getTime();
};

export const isThisEventStartInTimeRange = (
    event: EventFromServer,
    rangeStart: Date,
    rangeEnd: Date,
) => {
    return (
        event.startDateTime >= rangeStart.getTime() &&
        event.startDateTime <= rangeEnd.getTime()
    );
};
