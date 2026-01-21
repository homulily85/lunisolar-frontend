import client from "../graphql/client.ts";
import { type Event } from "../type.ts";
import { ADD_EVENT } from "../graphql/query.ts";

export const addNewEvent = async (event: Event) => {
    return await client.mutate<
        { addEvent: { id: string } },
        { newEvent: Event }
    >({
        mutation: ADD_EVENT,
        variables: { newEvent: event },
    });
};
