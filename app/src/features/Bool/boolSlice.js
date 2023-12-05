import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folderBool: false,
  modelBools: false,
  photo: false,
  file: false,
  viewLink: false,
  enteremail: false,
  filepath: null,
};

const booleanSlice = createSlice({
  name: "bool",
  initialState,
  reducers: {
    setBoolean: (state, action) => {
      state.folderBool = action.payload.folderBool;
      state.modelBools = action.payload.modelBools;
      state.photo = action.payload.photo;
      state.file = action.payload.file;
      state.viewLink = action.payload.viewLink;
    },
    setEnterEmail: (state, action) => {
      state.enteremail = action.payload.enteremail;
      state.filepath = action.payload.filepath;
    },
  },
});

export const { setBoolean, setEnterEmail } = booleanSlice.actions;

export const selectFolderBool = (state) => state.bool.folderBool;
export const selectModelBool = (state) => state.bool.modelBools;
export const selectPhotoBool = (state) => state.bool.photo;
export const selectFileBool = (state) => state.bool.file;
export const selectViewLinkBool = (state) => state.bool.viewLink;
export const selectEmailBool = (state) => state.bool.enteremail;
export const selectFilepath = (state) => state.bool.filepath;

export default booleanSlice.reducer;
