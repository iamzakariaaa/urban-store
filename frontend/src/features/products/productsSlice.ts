import { createSlice, createEntityAdapter, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductResponse } from '../../types/product';

const productsAdapter = createEntityAdapter<ProductResponse>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

interface FiltersState {
  category: string;
  sortBy: 'name' | 'price-low' | 'price-high';
  priceRange: [number, number];
}

interface ProductsUIState {
  searchQuery: string;
  filters: FiltersState;
  currentProduct: ProductResponse | null;
  currentProductLoading: boolean;
  currentProductError: string | null;
}

const initialState = productsAdapter.getInitialState<ProductsUIState>({
  searchQuery: '',
  filters: {
    category: 'all',
    sortBy: 'name',
    priceRange: [0, 1000],
  },
  currentProduct: null,
  currentProductLoading: false,
  currentProductError: null,
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<FiltersState>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.currentProductLoading = false;
      state.currentProductError = null;
    },
    setCurrentProduct(state, action: PayloadAction<ProductResponse>) {
      state.currentProduct = action.payload;
      state.currentProductLoading = false;
      state.currentProductError = null;
      productsAdapter.upsertOne(state, action.payload);
    },
    setCurrentProductLoading(state, action: PayloadAction<boolean>) {
      state.currentProductLoading = action.payload;
    },
    setCurrentProductError(state, action: PayloadAction<string | null>) {
      state.currentProductLoading = false;
      state.currentProductError = action.payload;
    },
    upsertProducts(state, action: PayloadAction<ProductResponse[]>) {
      productsAdapter.upsertMany(state, action.payload);
    },
  },
});

export const {
  setSearchQuery,
  setFilters,
  clearCurrentProduct,
  setCurrentProduct,
  setCurrentProductLoading,
  setCurrentProductError,
  upsertProducts,
} = productsSlice.actions;

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = productsAdapter.getSelectors((state: any) => state.products);

export const selectCurrentProduct = (state: any) => state.products.currentProduct;
export const selectCurrentProductLoading = (state: any) => state.products.currentProductLoading;
export const selectCurrentProductError = (state: any) => state.products.currentProductError;
export const selectSearchQuery = (state: any) => state.products.searchQuery;
export const selectFilters = (state: any) => state.products.filters;

// Memoized selector for filtered products
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilters, selectSearchQuery],
  (products, filters, searchQuery) => {
    let filtered = products;

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(
        p => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    filtered = filtered.slice().sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }
);

export default productsSlice.reducer;
