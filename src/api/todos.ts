// src/api/todos.ts
import axios from 'axios';
import { Todo, TodoFilter, FetchTodosResponse } from '../types/todo';

const API_URL = 'http://localhost:3001';

// Получаем токен из localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const fetchTodos = async (
  page: number,
  limit: number,
  filter: TodoFilter,
  sort: 'newest' | 'oldest' = 'newest'
): Promise<FetchTodosResponse> => {
  const response = await axios.get<FetchTodosResponse>(`${API_URL}/todos`, {
    params: { page, limit, filter, sort },
    ...getAuthHeaders(),
  });
  return response.data;
};

export const createTodo = async (text: string): Promise<Todo> => {
  const response = await axios.post<Todo>(`${API_URL}/todos`, { text }, getAuthHeaders());
  return response.data;
};

export const updateTodo = async (
  id: number,
  updates: { text?: string; completed?: boolean }
): Promise<Todo> => {
  const response = await axios.put<Todo>(`${API_URL}/todos/${id}`, updates, getAuthHeaders());
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`, getAuthHeaders());
};

export const toggleTodo = async (id: number): Promise<Todo> => {
  const response = await axios.patch<Todo>(`${API_URL}/todos/${id}/toggle`, {}, getAuthHeaders());
  return response.data;
};