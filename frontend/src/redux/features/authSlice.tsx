import { AuthResponseType } from "../../types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthResponseType = {
    accessToken: "",
    refreshToken: "",
    username: "",
    userID: 0,
};

export const authSlice = createSlice({
    initialState,
    name: "authSlice",
    reducers: {
        logout: () => initialState,
        setAuth: (state, action: PayloadAction<AuthResponseType>) => {
            const { accessToken, refreshToken, username, userID } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.username = username;
            state.userID = userID;
        },
    },
});

export default authSlice.reducer;

export const { logout, setAuth } = authSlice.actions;
