import client from "../graphql/client.ts";
import { type Event } from "../type.ts";
import { ADD_EVENT, GET_EVENT } from "../graphql/query.ts";

export const addNewEvent = async (event: Event) => {
    const result = await client.mutate<
        { addEvent: { id: string } },
        { newEvent: Event }
    >({
        mutation: ADD_EVENT,
        variables: { newEvent: event },
    });

    if (!result.data) {
        console.log(result.error);
        throw new Error();
    }
    return result.data.addEvent.id;
};

export const getEvents = async (startRange: Date, endRange: Date) => {
    const result = await client.query<
        { getEvents: Event[] },
        {
            rangeStart: string;
            rangeEnd: string;
        }
    >({
        query: GET_EVENT,
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
