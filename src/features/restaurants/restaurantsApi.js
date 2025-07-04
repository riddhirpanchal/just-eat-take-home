// src/features/restaurants/restaurantsApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import mockData from "../../mock.json";

const useMockData = true;

const realBaseQuery = fetchBaseQuery({
  baseUrl: "/api/",
});

export const customBaseQuery = async (args, api, extraOptions) => {
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { data: mockData };
  }

  try {
    const result = await realBaseQuery(args, api, extraOptions);

    if (result.error) {
      console.error("API Error:", result.error);
    }
    return result;
  } catch (error) {
    console.error("Network or other fetch error:", error);
    return {
      error: {
        status: "CUSTOM_ERROR",
        error:
          "A network error occurred. Please check your connection and try again.",
      },
    };
  }
};

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: customBaseQuery, // No change here
  endpoints: (builder) => ({
    getRestaurantsByPostcode: builder.query({
      query: (postcode) =>
        `discovery/uk/restaurants/enriched/bypostcode/${postcode}`,
    }),
  }),
});

export const { useGetRestaurantsByPostcodeQuery } = restaurantsApi;
