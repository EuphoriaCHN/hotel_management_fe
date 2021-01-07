import { configureStore } from '@reduxjs/toolkit'

import userReducer from './user';
import projectReducer from './project';

export default configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer
  }
});
