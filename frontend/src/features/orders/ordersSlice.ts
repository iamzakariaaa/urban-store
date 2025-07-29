import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderResponse } from '../../types/order';

interface OrderState {
  currentOrder: OrderResponse | null;
}

const initialState: OrderState = {
  currentOrder: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<OrderResponse>) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const { setCurrentOrder, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
