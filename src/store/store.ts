import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './todoSlice';
import authReducer from '../auth/authSlice'; 

export const store = configureStore({
  reducer: {
    todos: todoSlice,
     auth: authReducer, // ← добавь редьюсер авторизации
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 