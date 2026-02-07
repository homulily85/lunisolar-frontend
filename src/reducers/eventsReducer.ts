import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type EventFromServer } from "../type.ts";
import { expandEvent } from "../utils/events.ts";

const eventSlice = createSlice({
    name: "events",
    initialState: [] as EventFromServer[],
    reducers: {
        setEvents: (_state, action: PayloadAction<EventFromServer[]>) => {
            return action.payload;
        },

        addEvent: (state, action: PayloadAction<EventFromServer>) => {
            const startDateTime = new Date(action.payload.startDateTime);

            return [
                ...state,
                ...expandEvent(
                    action.payload,
                    new Date(
                        startDateTime.getFullYear(),
                        startDateTime.getMonth() - 1,
                        15,
                    ),
                    new Date(
                        startDateTime.getFullYear(),
                        startDateTime.getMonth() + 1,
                        15,
                    ),
                ),
            ];
        },

        removeEvent: (state, action: PayloadAction<EventFromServer>) => {
            return state.filter(
                (e) => e.id.split("_")[0] !== action.payload.id,
            );
        },

        updateEvent: (state, action: PayloadAction<EventFromServer>) => {
            const event = state.filter((e) => {
                return e.id.split("_")[0] !== action.payload.id;
            });

            const startDateTime = new Date(action.payload.startDateTime);

            return [
                ...event,
                ...expandEvent(
                    action.payload,
                    new Date(
                        startDateTime.getFullYear(),
                        startDateTime.getMonth() - 1,
                        15,
                    ),
                    new Date(
                        startDateTime.getFullYear(),
                        startDateTime.getMonth() + 1,
                        15,
                    ),
                ),
            ];
        },
    },
});

export default eventSlice.reducer;
export const { setEvents, addEvent, removeEvent, updateEvent } =
    eventSlice.actions;
