import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: number;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
 
}

interface UIState {
  darkMode: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
}

const initialState: UIState = {
  darkMode: true,
  mobileMenuOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    addNotification(state, action: PayloadAction<Omit<Notification, 'id'>>) {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification(state, action: PayloadAction<number>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleMobileMenu,
  closeMobileMenu,
  addNotification,
  removeNotification,
} = uiSlice.actions;

import type { RootState } from '../../app/store';

export const selectDarkMode = (state: RootState) => state.ui.darkMode;
export const selectMobileMenuOpen = (state: RootState) => state.ui.mobileMenuOpen;
export const selectNotifications = (state: RootState) => state.ui.notifications;

export default uiSlice.reducer;
