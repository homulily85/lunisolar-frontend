import { type EventFromServer } from "../type.ts";
import { rrulestr } from "rrule";

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

export const expandEvent = (
    event: EventFromServer,
    startRange: Date,
    endRange: Date,
) => {
    if (!event.rruleString) {
        return [event];
    } else {
        const expandedEvents: EventFromServer[] = [];

        const duration = event.endDateTime - event.startDateTime;

        const rule = rrulestr(event.rruleString, {
            dtstart: new Date(event.startDateTime),
            cache: true,
        });

        const dates = rule.between(startRange, endRange, true);

        const instances = dates.map((date) => {
            const instance = { ...event };

            instance.startDateTime = date.getTime();
            instance.endDateTime = new Date(
                date.getTime() + duration,
            ).getTime();

            instance.id = `${instance.id}_${date.getTime()}`;

            return instance;
        });

        expandedEvents.push(...instances);
        return expandedEvents;
    }
};
