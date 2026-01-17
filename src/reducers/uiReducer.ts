import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        showDialog: false,
    },
    reducers: {
        setShowAddEventDialog(state, action) {
            state.showDialog = action.payload;
        },
    },
});

export default uiSlice.reducer;
export const { setShowAddEventDialog } = uiSlice.actions;
