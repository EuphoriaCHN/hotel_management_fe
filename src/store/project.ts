import { createSlice } from '@reduxjs/toolkit';

const initializeData = {
  authHeaderKey: null,
  authHeaderValue: null
};

const projectSlice = createSlice({
  name: 'project',
  initialState: initializeData,
  reducers: {
    setAuthKey(state, action) {
      state.authHeaderKey = action.payload.authHeaderKey;
      state.authHeaderValue = action.payload.authHeaderValue;
    }
  }
});

export const { setAuthKey } = projectSlice.actions;

export default projectSlice.reducer;
