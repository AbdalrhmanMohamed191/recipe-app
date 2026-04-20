import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice/userSlice";
// import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,

  },
});
