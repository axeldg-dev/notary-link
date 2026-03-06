import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/usersSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
});
