import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: localStorage.getItem("uid") || null,
  photo: localStorage.getItem("photo") || null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogIn: (state, action) => {
      state.uid = action.payload.uid;
      state.photo = action.payload.photo;
      localStorage.setItem("uid", action.payload.uid);
      localStorage.setItem("photo", action.payload.photo);
    },
    setLogOut: (state) => {
      state.uid = null;
      state.photo = null;
      localStorage.removeItem("uid");
      localStorage.removeItem("photo");
    },
  },
});

export const { setLogIn, setLogOut } = UserSlice.actions;

export const selectUid = (state) => state.user.uid;
export const selectPhoto = (state) => state.user.photo;

export default UserSlice.reducer;
