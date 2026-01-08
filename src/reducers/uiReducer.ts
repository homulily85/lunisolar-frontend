import {createSlice} from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        showSidebar: true
    },
    reducers: {
        setShowSidebar(state, action) {
            state.showSidebar = action.payload;
        }
    }
});

export default uiSlice.reducer;
export const {setShowSidebar} = uiSlice.actions;