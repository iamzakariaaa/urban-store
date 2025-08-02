import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserResponse } from '../../types/user';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const token = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: UserResponse; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user)); 
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
    },
    clearError: (state) => {
      state.error = null;
    }, 
    setUser: (state, action: PayloadAction<UserResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload)); 
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUser,
} = authSlice.actions;

// Selectors
export const selectAuth = (state:any) => state.auth;
export const selectUser = (state:any) => state.auth.user;
export const selectIsAuthenticated = (state:any) => state.auth.isAuthenticated;
export const selectAuthLoading = (state:any) => state.auth.isLoading;
export const selectAuthError = (state:any) => state.auth.error;

export default authSlice.reducer;
