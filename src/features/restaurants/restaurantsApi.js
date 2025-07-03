import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import mockData from "../../mock.json";

const useMockData = true;

const realBaseQuery = fetchBaseQuery({
  baseUrl: "/api/",
});

const customBaseQuery = async (args, api, extraOptions) => {
  if (useMockData) {
    console.log("Using mock data for request:", args);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { data: mockData };
  }
  return realBaseQuery(args, api, extraOptions);
};

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getRestaurantsByPostcode: builder.query({
      query: (postcode) =>
        `discovery/uk/restaurants/enriched/bypostcode/${postcode}`,
    }),
  }),
});

export const { useGetRestaurantsByPostcodeQuery } = restaurantsApi;
