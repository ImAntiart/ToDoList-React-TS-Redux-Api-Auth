// src/auth/services/authService.ts
const API_URL = 'http://localhost:3001';

// Типы
export interface RegisterData {
  email: string;
  password: string;
  age?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

// Интерфейс ответа на login/register
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// Интерфейс пользователя
export interface User {
  id: number;
  email: string;
  age?: number;
  createdAt: string;
}

// Универсальная функция запроса
const request = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Что-то пошло не так');
  }

  return data;
};

// Регистрация
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Вход
export const login = async (data: LoginData): Promise<AuthResponse> => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Обновление токенов
export const refreshTokens = async (refreshToken: string): Promise<AuthResponse> => {
  return request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
};

// Получение профиля
export const fetchProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Не удалось загрузить профиль');
  }

  return data;
};

// Смена пароля
export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Не удалось сменить пароль');
  }
};