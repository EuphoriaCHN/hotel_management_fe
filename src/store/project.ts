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
      const { authHeaderKey, authHeaderValue } = action.payload;

      if (authHeaderValue && authHeaderValue.length) {
        window.sessionStorage.setItem('Authorization', authHeaderValue);
      } else {
        window.sessionStorage.removeItem('Authorization');
      }

      state.authHeaderKey = authHeaderKey;
      state.authHeaderValue = authHeaderValue;
    }
  }
});

export const { setAuthKey } = projectSlice.actions;

export default projectSlice.reducer;
