import client from "../graphql/client.ts";
import { type EventFromClient, type EventFromServer } from "../type.ts";
import {
    ADD_EVENT,
    DELETE_EVENT,
    GET_EVENTS,
    UPDATE_EVENT,
} from "../graphql/query.ts";

import { type Reference, type StoreObject } from "@apollo/client";

const extractArgsFromStoreFieldName = <T>(
    storeFieldName: string,
    fieldName: string,
): T | null => {
    if (!storeFieldName.startsWith(`${fieldName}(`)) {
        return null;
    }

    try {
        const openParenIndex = storeFieldName.indexOf("(");
        const closeParenIndex = storeFieldName.lastIndexOf(")");

        if (openParenIndex === -1 || closeParenIndex === -1) return null;

        const jsonString = storeFieldName.substring(
            openParenIndex + 1,
            closeParenIndex,
        );

        return JSON.parse(jsonString) as T;
    } catch {
        console.warn(
            `Failed to parse args from storeFieldName: ${storeFieldName}`,
        );
        return null;
    }
};

export const addNewEvent = async (event: EventFromClient) => {
    const result = await client.mutate<
        { addEvent: EventFromServer },
        { newEvent: EventFromClient }
    >({
        mutation: ADD_EVENT,
        variables: { newEvent: event },
        update: (cache, { data }) => {
            if (!data) return;

            const newEvent = data.addEvent;

            cache.modify({
                fields: {
                    getEvents(
                        existingEventsRefs: readonly Reference[] = [],
                        details,
                    ) {
                        const args = extractArgsFromStoreFieldName<{
                            rangeStart: string;
                            rangeEnd: string;
                        }>(details.storeFieldName, "getEvents");

                        if (!args) {
                            return existingEventsRefs;
                        }

                        const queryStart = new Date(args.rangeStart);
                        const queryEnd = new Date(args.rangeEnd);
                        const eventStart = new Date(newEvent.startDateTime);
                        const eventEnd = new Date(newEvent.endDateTime);

                        const isOverlapping =
                            eventStart <= queryEnd && eventEnd >= queryStart;

                        const recursIntoRange =
                            Boolean(newEvent.rruleString) &&
                            eventStart <= queryEnd;

                        if (!isOverlapping && !recursIntoRange) {
                            return existingEventsRefs;
                        }

                        const isAlreadyInCache = existingEventsRefs.some(
                            (ref) =>
                                details.readField("id", ref) === newEvent.id,
                        );

                        if (isAlreadyInCache) {
                            return existingEventsRefs;
                        }

                        const newEventRef = details.toReference(
                            newEvent as unknown as StoreObject,
                        );

                        if (!newEventRef) return existingEventsRefs;

                        return [...existingEventsRefs, newEventRef];
                    },
                },
            });
        },
    });

    if (!result.data) {
        throw new Error("Mutation failed");
    }

    return result.data.addEvent.id;
};

export const updateAnEvent = async (event: EventFromClient) => {
    const result = await client.mutate<
        { updateEvent: EventFromServer },
        { eventToBeUpdated: EventFromClient }
    >({
        mutation: UPDATE_EVENT,
        variables: { eventToBeUpdated: event },
        update: (cache, { data }) => {
            if (!data) return;

            const updatedEvent = data.updateEvent;

            cache.modify({
                fields: {
                    getEvents(
                        existingEventsRefs: readonly Reference[] = [],
                        { storeFieldName, readField, toReference },
                    ) {
                        const args = extractArgsFromStoreFieldName<{
                            rangeStart: string;
                            rangeEnd: string;
                        }>(storeFieldName, "getEvents");

                        if (!args) {
                            return existingEventsRefs;
                        }

                        const queryStart = new Date(args.rangeStart);
                        const queryEnd = new Date(args.rangeEnd);
                        const eventStart = new Date(updatedEvent.startDateTime);
                        const eventEnd = new Date(updatedEvent.endDateTime);

                        const isOverlapping =
                            eventStart <= queryEnd && eventEnd >= queryStart;

                        const recursIntoRange =
                            Boolean(updatedEvent.rruleString) &&
                            eventStart <= queryEnd;

                        const shouldBeInList = isOverlapping || recursIntoRange;

                        const currentRefIndex = existingEventsRefs.findIndex(
                            (ref) => readField("id", ref) === updatedEvent.id,
                        );
                        const isCurrentlyInList = currentRefIndex > -1;

                        // Event is currently in the list, but dates changed so it no longer fits.
                        if (isCurrentlyInList && !shouldBeInList) {
                            return existingEventsRefs.filter(
                                (_, index) => index !== currentRefIndex,
                            );
                        }

                        // Event fits in this list, but isn't there yet (moved from another month).
                        if (!isCurrentlyInList && shouldBeInList) {
                            const newRef = toReference(
                                updatedEvent as unknown as StoreObject,
                            );

                            if (!newRef) return existingEventsRefs;
                            return [...existingEventsRefs, newRef];
                        }

                        // Event is already there and still fits (Apollo auto-updates fields).
                        return existingEventsRefs;
                    },
                },
            });
        },
    });

    if (!result.data) {
        throw new Error("Update failed");
    }

    return result.data.updateEvent.id;
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
    const actualId = event.id.split("_")[0];

    const result = await client.mutate<
        { deleteEvent: string },
        { eventId: string }
    >({
        mutation: DELETE_EVENT,
        variables: { eventId: actualId },
        update: (cache) => {
            const normalizedId = cache.identify({
                id: actualId,
                __typename: "EventFromServer",
            });

            cache.evict({ id: normalizedId });

            cache.gc();
        },
    });

    if (!result.data) {
        console.log(result.error);
        throw new Error();
    }
};
