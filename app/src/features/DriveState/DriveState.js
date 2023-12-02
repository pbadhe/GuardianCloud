import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timestamp: null,
};

const DriveSlice = createSlice({
  name: "drive",
  initialState,
  reducers: {
    setDrive: (state, action) => {
      state.timestamp = action.payload.timestamp;
    },
  },
});

export const { setDrive } = DriveSlice.actions;

export const selectDrive = (state) => state.drive.timestamp;

export default DriveSlice.reducer;
