import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: "",
        id: "",
        token: "",
        profilePictureLink: "",
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setId: (state, action) => {
            state.id = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setProfilePictureLink: (state, action) => {
            state.profilePictureLink = action.payload;
        },
    },
});

export default userSlice.reducer;
export const { setId, setName, setProfilePictureLink, setToken } =
    userSlice.actions;
