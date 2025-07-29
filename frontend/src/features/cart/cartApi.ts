import { apiSlice } from '../api/apiSlice';
import type { CartItemRequest, CartItem } from '../../types/cart';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], string>({
      query: (userId) => ({
        url: '/cart',
        headers: { 'X-User-ID': userId },
      }),
    }),
    addToCart: builder.mutation<void, { userId: string } & CartItemRequest>({
      query: ({ userId, ...data }) => ({
        url: '/cart',
        method: 'POST',
        headers: { 'X-User-ID': userId },
        body: data,
      }),
    }),
    updateCartItem: builder.mutation<void, { userId: string } & CartItemRequest>({
      query: ({ userId, ...data }) => ({
        url: '/cart',
        method: 'PUT',
        headers: { 'X-User-ID': userId },
        body: data,
      }),
    }),
    removeCartItem: builder.mutation<void, { userId: string; productId: number }>({
      query: ({ userId, productId }) => ({
        url: `/cart/items/${productId}`,
        method: 'DELETE',
        headers: { 'X-User-ID': userId },
      }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
