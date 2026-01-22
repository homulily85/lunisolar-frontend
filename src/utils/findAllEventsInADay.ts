import { type Event } from "../type.ts";

const findAllEventsInADay = (events: Event[], date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(24, 0, 0, 0);

    const startMs = start.getTime();
    const endMs = end.getTime();

    return events.filter((e) => {
        const eventTime = Number(e.startDateTime);
        return eventTime >= startMs && eventTime < endMs;
    });
};

export default findAllEventsInADay;
