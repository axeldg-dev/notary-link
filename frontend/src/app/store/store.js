import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.ts";
import userReducer from "../features/userSlice";
import projectReducer from "../features/projectSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        project: projectReducer,
    }
});
