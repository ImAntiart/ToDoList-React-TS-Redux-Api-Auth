import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { TodoFilter } from "./types/todo";
import { AddTodo } from "./components/AddTodo";
import { TodoList } from "./components/TodoList";
import { ThemeProvider } from "./components/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import {
  createTodo as apiCreateTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo,
} from "./api/todos";
import { fetchTodosAsync } from "./store/todoSlice";
import { AppDispatch, RootState } from "./store/store";
import { setSortOrder } from './store/todoSlice';
import { setFilter } from './store/todoSlice';

function App() {
const dispatch = useDispatch<AppDispatch>();

  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const sortOrder = useSelector((state: RootState) => state.todos.sortOrder);
  const page = useSelector((state: RootState) => state.todos.page);
  const limit = useSelector((state: RootState) => state.todos.limit);
  const status = useSelector((state: RootState) => state.todos.status);
  const error = useSelector((state: RootState) => state.todos.error);

  useEffect(() => {
    dispatch(fetchTodosAsync());
  }, [dispatch, page, limit, filter, sortOrder]);

  const handleAddTodo = async (text: string) => {
    if (!text.trim()) return;

    try {
      await apiCreateTodo(text);
      dispatch(fetchTodosAsync());
    } catch (err) {
      console.error("Ошибка при добавлении задачи:", err);
    }
  };

  const handleSaveTodo = async (
    id: number,
    newText: string,
    completed: boolean
  ) => {
    if (!newText.trim()) return;

    try {
      await apiUpdateTodo(id, { text: newText, completed });
      dispatch(fetchTodosAsync());
    } catch (err) {
      console.error("Ошибка при обновлении задачи:", err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await apiDeleteTodo(id);
      dispatch(fetchTodosAsync());
    } catch (err) {
      console.error("Ошибка при удалении задачи:", err);
    }
  };

const handleFilterChange = (newFilter: TodoFilter) => {
  console.log('Filter changed to:', newFilter);
  dispatch(setFilter(newFilter));
  dispatch(fetchTodosAsync()); // 
};

const handleSortChange = (newSortOrder: 'newest' | 'oldest') => {
  dispatch(setSortOrder(newSortOrder));
};


  if (status === "failed") {
    return (
      <ThemeProvider>
        <ThemeToggle />
        <main className="main">
          <p style={{ color: "red" }}>Ошибка: {error}</p>
          <button onClick={() => dispatch(fetchTodosAsync())}>
            Попробовать снова
          </button>
        </main>
      </ThemeProvider>
    );
  }

const processedTodos = [...todos].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <ThemeProvider>
      <ThemeToggle />
      <header className="header">
        <h1>Список задач</h1>
      </header>
      <main className="main">
        <aside className="wood-column left"></aside>
        <aside className="wood-column right"></aside>

        <AddTodo
          onAdd={handleAddTodo}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        <TodoList
          todos={processedTodos}
          onSave={handleSaveTodo}
          onDelete={handleDeleteTodo}
        />

        
      </main>

      <footer className="footer">
        <p>Разработчик Antiart, aka Ромашев Алексей Дмитриевич</p>
      </footer>
    </ThemeProvider>
  );
}

export default App;
