import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        showAddEventDialog: false,
        showUpdateEventDialog: false,
        showDeleteOptionDialog: false,
        eventToBeModified: {},
        eventTobeDeleted: {},
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
        setShowDeleteOptionDialog(state, action) {
            state.showDeleteOptionDialog = action.payload;
        },
        setEventTobeDeleted(state, action) {
            state.eventTobeDeleted = action.payload;
        },
    },
});

export default uiSlice.reducer;
export const {
    setShowAddEventDialog,
    setShowUpdateEventDialog,
    setEventToBeModified,
    setShowDeleteOptionDialog,
    setEventTobeDeleted,
} = uiSlice.actions;
