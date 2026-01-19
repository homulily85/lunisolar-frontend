import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: "",
        userId: "",
        accessToken: "",
        profilePictureLink: "",
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setProfilePictureLink: (state, action) => {
            state.profilePictureLink = action.payload;
        },
    },
});

export default userSlice.reducer;
export const { setUserId, setName, setProfilePictureLink, setAccessToken } =
    userSlice.actions;
