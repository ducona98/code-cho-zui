import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base RTK Query API
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [], // Add your tag types here for cache invalidation
  endpoints: () => ({}), // Endpoints will be injected via injectEndpoints
});

// Typed hooks for RTK Query
export const {
  // You can export common hooks here if needed
} = baseApi;
