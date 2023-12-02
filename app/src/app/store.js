import { configureStore } from "@reduxjs/toolkit";
import boolReducer from "../features/Bool/boolSlice";
import photoReducer from "../features/photoDisplay/photoSlice";
import userReducer from "../features/user/userSlice";
import driveReducer from "../features/DriveState/DriveState";

//Middleware to update localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Update localStorage based on the state changes
  const state = store.getState();
  console.log("uid read from state:", state.user.uid);

  localStorage.setItem("uid", state.user.uid);
  localStorage.setItem("photo", state.user.photo);
  console.log("Updated uid in localStorage:", state.user.uid);

  return result;
};

export const store = configureStore({
  reducer: {
    bool: boolReducer,
    photos: photoReducer,
    user: userReducer,
    drive: driveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
