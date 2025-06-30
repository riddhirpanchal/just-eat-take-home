import { configureStore } from "@reduxjs/toolkit";
import { restaurantsApi } from "../features/restaurants/restaurantsApi";

export const store = configureStore({
  reducer: {
    [restaurantsApi.reducerPath]: restaurantsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(restaurantsApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export default store;
