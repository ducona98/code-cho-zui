import axiosInstance from "../api/axios";
import { baseApi } from "../store/api/baseApi";

// Example: RTK Query endpoint injection
export const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Example GET endpoint
    getUsers: builder.query<User[], void>({
      query: () => "/users",
    }),
    // Example POST endpoint
    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const { useGetUsersQuery, useCreateUserMutation } = exampleApi;

// Example types (you should define these based on your API)
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserDto {
  name: string;
  email: string;
}

// Example: Using axios directly (alternative to RTK Query)
export const userService = {
  getUsers: async () => {
    const response = await axiosInstance.get<User[]>("/users");
    return response.data;
  },
  createUser: async (data: CreateUserDto) => {
    const response = await axiosInstance.post<User>("/users", data);
    return response.data;
  },
};
