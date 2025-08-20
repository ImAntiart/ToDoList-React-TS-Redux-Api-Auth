// src/types/index.ts

/**
 * Тип фильтра задач
 */
// src/types/index.ts

export type TodoFilter = 'all' | 'completed' | 'active'; // Оставь 'all', но измени логику

/**
 * Порядок сортировки
 */
export type SortOrder = 'newest' | 'oldest';

/**
 * Тип даты фильтрации
 */
export type DateFilter = 'all' | 'today' | 'week' | 'month';

/**
 * Интерфейс задачи
 * Обновляем createdAt на string — так приходит с сервера
 */
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Ответ от API при получении задач
 */
export interface FetchTodosResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}