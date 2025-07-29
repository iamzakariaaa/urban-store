import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  selectedUserId: number | null;
}

const initialState: UserState = {
  selectedUserId: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUserId(state, action) {
      state.selectedUserId = action.payload;
    },
  },
});

export const { setSelectedUserId } = usersSlice.actions;
export default usersSlice.reducer;
