import {createSlice} from '@reduxjs/toolkit';

const now = Date.now();

const dateSlice = createSlice({
    name: 'date',
    initialState: {
        currentSelectedSolarDate: now,
        today: now,
    },
    reducers: {
        setCurrentSelectedSolarDate(state, action) {
            state.currentSelectedSolarDate = action.payload;
        },
    }
});

export default dateSlice.reducer;
export const {
    setCurrentSelectedSolarDate,
} = dateSlice.actions;