import { createSlice } from '@reduxjs/toolkit';

const initializeData = {
  type: null,
  account: null,
  password: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initializeData,
  reducers: {
    setUser(state, action) {
      state.type = action.payload.type;
      state.account = action.payload.account;
      state.password = action.payload.password;
    }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
