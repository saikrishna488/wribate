import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      console.log("clicked");
      state.categories = action.payload;
    },
    clearCategories: (state) => {
      state.categories = null;
    },
  },
});

export const { setCategories, clearCategories } = categorySlice.actions;

export default categorySlice.reducer;
