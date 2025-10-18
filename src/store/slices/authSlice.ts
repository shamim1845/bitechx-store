import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
    token: string | null;
    email: string | null;
};

const initialState: AuthState = {
    token: null,
    email: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; email: string }>
        ) => {
            state.token = action.payload.token;
            state.email = action.payload.email;
        },
        clearAuth: (state) => {
            state.token = null;
            state.email = null;
        },
    },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;

