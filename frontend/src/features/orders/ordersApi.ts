import { apiSlice } from '../api/apiSlice';
import type { OrderResponse } from '../../types/order';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, string>({
      query: (userId) => ({
        url: '/orders',
        method: 'POST',
        headers: { 'X-User-ID': userId },
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = ordersApi;
