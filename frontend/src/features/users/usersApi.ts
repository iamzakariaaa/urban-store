import { apiSlice } from '../api/apiSlice';
import type { UserRequest, UserResponse } from '../../types/user';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUser: builder.query<UserResponse, number>({
      query: (id) => `/users/${id}`,
    }),
    createUser: builder.mutation<string, UserRequest>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
    }),
    updateUser: builder.mutation<string, { id: number; user: UserRequest }>({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: user,
      }),
      transformResponse: (response: string) => response, 
    }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApi;
