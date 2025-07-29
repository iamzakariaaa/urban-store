import { apiSlice } from '../api/apiSlice';
import type { ProductResponse, ProductRequest } from '../../types/product';
import { upsertProducts } from './productsSlice'; 

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse[], void>({
      query: () => '/products',
      providesTags: ['Product'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertProducts(data)); 
        } catch (err) {
          console.error('Error fetching products:', err);
        }
      },
    }),

    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
    }),

    createProduct: builder.mutation<ProductResponse, ProductRequest>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<ProductResponse, { id: number } & ProductRequest>({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
