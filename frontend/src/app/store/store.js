import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/usersSlice";
import userReducer from "../features/userSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    }
});
