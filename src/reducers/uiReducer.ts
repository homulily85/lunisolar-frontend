import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        showAddEventDialog: false,
        showDeleteOptionDialog: false,
        eventTobeDeleted: {},
    },
    reducers: {
        setShowAddEventDialog(state, action) {
            state.showAddEventDialog = action.payload;
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
    setShowDeleteOptionDialog,
    setEventTobeDeleted,
} = uiSlice.actions;
