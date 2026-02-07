import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        showAddEventDialog: false,
        showUpdateEventDialog: false,
        eventToBeModified: {},
    },
    reducers: {
        setShowAddEventDialog(state, action) {
            state.showAddEventDialog = action.payload;
        },
        setShowUpdateEventDialog(state, action) {
            state.showUpdateEventDialog = action.payload;
        },
        setEventToBeModified(state, action) {
            state.eventToBeModified = action.payload;
        },
    },
});

export default uiSlice.reducer;
export const {
    setShowAddEventDialog,
    setShowUpdateEventDialog,
    setEventToBeModified,
} = uiSlice.actions;
