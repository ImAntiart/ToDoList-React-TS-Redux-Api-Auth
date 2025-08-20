// src/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Типы
export interface User {
  id: number;
  email: string;
  age?: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

// Начальное состояние
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  status: "idle",
  error: null,
};

// Слайс
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Вход и регистрация

    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User | null; // ← разрешаем null
        token: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.status = "idle";
      state.error = null;
    },

    // Обновление токенов
    refreshSuccess: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },

    // Получение профиля
    setProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // Выход
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    },

    // Смена пароля
    passwordChanged: (state) => {
      state.error = null;
    },

    // Ошибки
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Сброс ошибки
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  refreshSuccess,
  setProfile,
  logout,
  passwordChanged,
  setError,
  clearError,
} = authSlice.actions;

// Экспортируем редьюсер
export default authSlice.reducer;
