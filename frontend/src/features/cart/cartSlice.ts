import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types/cart';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  error: string | null;
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isDrawerOpen: false,
  error: null,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCartDrawer(state) {
      state.isDrawerOpen = true;
    },
    closeCartDrawer(state) {
      state.isDrawerOpen = false;
    },
    toggleCartDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    clearCart(state) {
      state.items = [];
    },
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addOrUpdateCartItem(state, action: PayloadAction<CartItem>) {
      const index = state.items.findIndex(item => item.product.id === action.payload.product.id);
      if (index >= 0) {
        state.items[index].quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeCartItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    },
    optimisticUpdateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find(item => item.product.id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  clearCart,
  setCartItems,
  addOrUpdateCartItem,
  removeCartItem,
  optimisticUpdateQuantity,
  setError,
  setLoading,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartDrawerOpen = (state: { cart: CartState }) => state.cart.isDrawerOpen;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
