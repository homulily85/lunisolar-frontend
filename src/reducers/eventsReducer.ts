import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Event } from "../type.ts";

const eventSlice = createSlice({
    name: "events",
    initialState: [] as Event[],
    reducers: {
        setEvents: (state, action: PayloadAction<Event[]>) => {
            state.splice(0, state.length, ...action.payload);
        },
    },
});

export default eventSlice.reducer;
export const { setEvents } = eventSlice.actions;
