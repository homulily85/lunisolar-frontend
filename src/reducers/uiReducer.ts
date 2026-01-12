import {createSlice} from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        showSidebar: true,
        showDialog: false
    },
    reducers: {
        setShowSidebar(state, action) {
            state.showSidebar = action.payload;
        },
        setShowDialog(state, action) {
            state.showDialog = action.payload;
        }
    }
});

export default uiSlice.reducer;
export const {setShowSidebar, setShowDialog} = uiSlice.actions;