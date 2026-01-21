import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: "",
        id: "",
        accessToken: "",
        profilePictureLink: "",
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setId: (state, action) => {
            state.id = action.payload;
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
export const { setId, setName, setProfilePictureLink, setAccessToken } =
    userSlice.actions;
