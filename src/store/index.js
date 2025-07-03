import { configureStore } from "@reduxjs/toolkit";
import { restaurantsApi } from "../features/restaurants/restaurantsApi";
import searchReducer from "../features/search/searchSlice";

export const store = configureStore({
  reducer: {
    [restaurantsApi.reducerPath]: restaurantsApi.reducer,
    search: searchReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(restaurantsApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export default store;
