import { createSlice } from '@reduxjs/toolkit';

const initializeData = {
  types: {},
  rooms: []
};

const projectSlice = createSlice({
  name: 'room',
  initialState: initializeData,
  reducers: {
    setRooms(state, action) {
      while (state.rooms.length) {
        state.rooms.pop();
      }
      state.rooms.push(...action.payload.rooms);
    },
    setTypes(state, action) {
      Object.keys(state.types).forEach(key => {
        delete state.types[key];
      });
      Object.keys(action.payload.types).forEach(key => {
        state.types[key] = action.payload.types[key];
      });
    }
  }
});

export const { setRooms, setTypes } = projectSlice.actions;

export default projectSlice.reducer;
