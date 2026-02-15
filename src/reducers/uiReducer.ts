import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        showAddEventDialog: false,
        showDeleteOptionDialog: false,
        showEventDetailDialog: false,
        eventTobeDeleted: {},
        eventToShowDetail: {},
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
        setShowEventDetailDialog(state, action) {
            state.showEventDetailDialog = action.payload;
        },
        setEventToShowDetail(state, action) {
            state.eventToShowDetail = action.payload;
        },
    },
});

export default uiSlice.reducer;
export const {
    setShowAddEventDialog,
    setShowDeleteOptionDialog,
    setEventTobeDeleted,
    setShowEventDetailDialog,
    setEventToShowDetail,
} = uiSlice.actions;
