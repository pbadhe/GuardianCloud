import { configureStore } from "@reduxjs/toolkit";
import boolReducer from "../features/Bool/boolSlice";
import photoReducer from "../features/photoDisplay/photoSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    bool: boolReducer,
    photos: photoReducer,
    user: userReducer,
  },
});
