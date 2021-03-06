import { configureStore } from '@reduxjs/toolkit'

import userReducer from './user';
import projectReducer from './project';
import roomReducer from './room';

export default configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    room: roomReducer
  }
});
