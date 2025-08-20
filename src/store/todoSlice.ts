import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTodos as apiFetchTodos } from "../api/todos";
import { Todo, TodoFilter, FetchTodosResponse } from "../types/todo";
import { RootState } from "./store";
export interface TodoState {
  todos: Todo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  limit: number;
  filter: TodoFilter;
  sortOrder: "newest" | "oldest";
  total: number;
  totalPages: number;
}

const initialState: TodoState = {
  todos: [],
  status: "idle",
  error: null,
  page: 1,
  limit: 10,
  filter: "all",
  sortOrder: "newest",
  total: 0,
  totalPages: 1,
};

export const fetchTodosAsync = createAsyncThunk<
  FetchTodosResponse,
  void,
  { rejectValue: string }
>("todos/fetchTodos", async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const { page, limit, filter, sortOrder } = state.todos;

  try {
    const response = await apiFetchTodos(page, limit, filter, sortOrder);
    return response;
  } catch (err: unknown) {
    let message = 'Неизвестная ошибка';
    if (err instanceof Error) {
      message = err.message;
    }
    if (typeof err === 'object' && err !== null) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      if (axiosError.response?.data?.error) {
        return rejectWithValue(axiosError.response.data.error);
      }
    }
    return rejectWithValue(message);
  }
});

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setFilter: (state, action: { payload: TodoFilter }) => {
      state.filter = action.payload;
      state.page = 1;
    },
    setSortOrder: (state, action: { payload: "newest" | "oldest" }) => {
      state.sortOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTodosAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Ошибка загрузки задач";
      });
  },
});

export const { setPage, setLimit, setFilter, setSortOrder } = todoSlice.actions;
export default todoSlice.reducer;
