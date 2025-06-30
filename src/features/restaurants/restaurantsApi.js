import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://uk.api.just-eat.io/discovery/uk/",
  }),
  endpoints: (builder) => ({
    getRestaurantsByPostcode: builder.query({
      query: (postcode) => `restaurants/enriched/bypostcode/${postcode}`,
    }),
  }),
});

export const { useGetRestaurantsByPostcodeQuery } = restaurantsApi;
