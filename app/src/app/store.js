import { configureStore } from "@reduxjs/toolkit";
import boolReducer from "../features/Bool/boolSlice";
import photoReducer from "../features/photoDisplay/photoSlice";
import userReducer from "../features/user/userSlice";
import driveReducer from "../features/DriveState/DriveState";

export const store = configureStore({
  reducer: {
    bool: boolReducer,
    photos: photoReducer,
    user: userReducer,
    drive: driveReducer,
  },
});
