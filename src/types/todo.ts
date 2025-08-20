
export type TodoFilter = 'all' | 'completed' | 'active';

export type SortOrder = 'newest' | 'oldest';

export type DateFilter = 'all' | 'today' | 'week' | 'month';
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}
export interface FetchTodosResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}