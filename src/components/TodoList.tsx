import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  onSave: (id: number, text: string, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoList = ({ todos, onSave, onDelete }: TodoListProps) => {
  return (
    <div className="board">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};