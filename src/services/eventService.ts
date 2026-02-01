import client from "../graphql/client.ts";
import { type EventFromClient, type EventFromServer } from "../type.ts";
import { ADD_EVENT, DELETE_EVENT, GET_EVENTS } from "../graphql/query.ts";

export const addNewEvent = async (event: EventFromClient) => {
    const result = await client.mutate<
        { addEvent: EventFromServer },
        { newEvent: EventFromClient }
    >({
        mutation: ADD_EVENT,
        variables: { newEvent: event },
        update: (cache, result) => {
            if (!result.data) return;
            const currentDate = new Date(event.startDateTime);
            currentDate.setDate(1);
            const endDate = new Date(event.endDateTime);
            while (currentDate <= endDate) {
                const startRange = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    15,
                );

                const endRange = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    15,
                );

                cache.updateQuery<{ getEvents: EventFromServer[] }>(
                    {
                        query: GET_EVENTS,
                        variables: {
                            rangeStart: startRange.toISOString(),
                            rangeEnd: endRange.toISOString(),
                        },
                    },
                    (data) => {
                        if (!data || !data.getEvents) {
                            return { getEvents: [result.data!.addEvent] };
                        }
                        return {
                            getEvents: data.getEvents.concat(
                                result.data!.addEvent,
                            ),
                        };
                    },
                );
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        },
    });

    if (!result.data) {
        console.log(result.error);
        throw new Error();
    }

    return result.data.addEvent.id;
};

export const getEvents = async (startRange: Date, endRange: Date) => {
    const result = await client.query<
        { getEvents: EventFromServer[] },
        {
            rangeStart: string;
            rangeEnd: string;
        }
    >({
        query: GET_EVENTS,
        variables: {
            rangeStart: startRange.toISOString(),
            rangeEnd: endRange.toISOString(),
        },
    });

    if (!result.data) {
        console.log(result.error);
        throw new Error();
    }

    return result.data.getEvents;
};

export const deleteEvent = async (event: EventFromServer) => {
    const result = await client.mutate<
        { deleteEvent: string },
        { eventId: string }
    >({
        mutation: DELETE_EVENT,
        variables: { eventId: event.id },
        update: (cache, result) => {
            if (!result.data) return;
            const currentDate = new Date(event.startDateTime);
            currentDate.setDate(1);
            const endDate = new Date(event.endDateTime);
            while (currentDate <= endDate) {
                const startRange = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    15,
                );

                const endRange = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    15,
                );

                cache.updateQuery<{ getEvents: EventFromServer[] }>(
                    {
                        query: GET_EVENTS,
                        variables: {
                            rangeStart: startRange.toISOString(),
                            rangeEnd: endRange.toISOString(),
                        },
                    },
                    (data) => {
                        if (!data || !data.getEvents) {
                            return { getEvents: [] };
                        }
                        return {
                            getEvents: data.getEvents.filter(
                                (e) => e.id !== event.id,
                            ),
                        };
                    },
                );
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        },
    });

    if (!result.data) {
        console.log(result.error);
        throw new Error();
    }
};
