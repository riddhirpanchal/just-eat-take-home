import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  postcode: null,
  area: null,
  status: "idle",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.postcode = action.payload.postcode;
      state.area = action.payload.area;
      state.status = "searched";
    },

    resetSearch: (state) => {
      state.postcode = null;
      state.area = null;
      state.status = "idle";
    },
  },
});

export const { setSearchQuery, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;
