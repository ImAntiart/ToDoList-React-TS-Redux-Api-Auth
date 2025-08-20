import axios from 'axios';
import { Todo, TodoFilter, FetchTodosResponse } from '../types/todo'; 

const API_URL = 'http://localhost:3001';

export const fetchTodos = async (
  page: number,
  limit: number,
  filter: TodoFilter,
  sort: 'newest' | 'oldest' = 'newest'
): Promise<FetchTodosResponse> => {
  const response = await axios.get<FetchTodosResponse>(`${API_URL}/todos`, {
    params: { page, limit, filter, sort },
  });
  return response.data;
};

export const createTodo = async (text: string): Promise<Todo> => {
  const response = await axios.post<Todo>(`${API_URL}/todos`, { text });
  return response.data;
};

export const updateTodo = async (
  id: number,
  updates: { text?: string; completed?: boolean }
): Promise<Todo> => {
  const response = await axios.put<Todo>(`${API_URL}/todos/${id}`, updates);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`);
};

export const toggleTodo = async (id: number): Promise<Todo> => {
  const response = await axios.patch<Todo>(`${API_URL}/todos/${id}/toggle`);
  return response.data;
};