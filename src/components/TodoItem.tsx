import { useState } from "react";
import { EditTodo } from "./EditTodo";
import { Todo } from "../types/todo";

type TodoItemProps = {
  todo: Todo;
  onSave: (id: number, newText: string, completed: boolean) => void;
  onDelete: (id: number) => void;
};

export const TodoItem = ({ todo, onSave, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(todo.completed);

  const toggleCompleted = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    onSave(todo.id, todo.text, newCompleted);
  };
 
const formatDate = (date: string) => {
  return new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  if (isEditing) {
    return (
      <EditTodo
        todo={todo}
        onSave={(id, newText) => {
          onSave(id, newText, completed);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className={`todo-item ${completed ? "completed" : ""}`}>
      <h2>{todo.text}</h2>
      <div
        className="completedStatus"
        onClick={(e) => {
          e.stopPropagation();
          toggleCompleted();
        }}
      >
        {completed ? "Выполнено" : "Не выполнено"}
      </div>
<div>Дата: {formatDate(todo.createdAt)}</div>
      <div className="todo-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="edit-button"
          aria-label="Edit"
        >
          Редактировать
        </button>
        <button
          title="удалить"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
          className="delete-button"
        >
        </button>
      </div>
    </div>
  );
};
