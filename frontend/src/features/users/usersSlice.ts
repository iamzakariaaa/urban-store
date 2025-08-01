import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  selectedUserId: number | null;
  isEditing: boolean;
}

const initialState: UserState = {
  selectedUserId: null,
  isEditing: false,
};
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
    setEditMode: (state, action) => {
      state.isEditing = action.payload;
    },
  },
});

export const { setSelectedUserId, setEditMode } = usersSlice.actions;

// Selectors
export const selectSelectedUserId = (state:any) => state.users.selectedUserId;
export const selectUserEditMode = (state:any) => state.users.isEditing;

export default usersSlice.reducer;