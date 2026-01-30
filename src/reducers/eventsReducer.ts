import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type EventFromServer } from "../type.ts";

const eventSlice = createSlice({
    name: "events",
    initialState: [] as EventFromServer[],
    reducers: {
        setEvents: (_state, action: PayloadAction<EventFromServer[]>) => {
            return action.payload;
        },
        addEvent: (state, action: PayloadAction<EventFromServer>) => {
            state.push(action.payload);
        },
        removeEvent: (state, action: PayloadAction<EventFromServer>) => {
            return state.filter((e) => e.id !== action.payload.id);
        },
    },
});

export default eventSlice.reducer;
export const { setEvents, addEvent, removeEvent } = eventSlice.actions;
