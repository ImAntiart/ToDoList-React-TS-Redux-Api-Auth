import { useState } from "react";
import { Todo } from "../types/todo";

type EditTodoProps = {
  todo: Todo;
  onSave: (id: number, newText: string, completed: boolean) => void;
  onCancel: () => void;
};

export const EditTodo = ({ todo, onSave, onCancel }: EditTodoProps) => {
  const [editedText, setEditedText] = useState(todo.text);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!editedText.trim()) {
      setError("Текст задачи не может быть пустым!");
      return; 
    }
    setError(""); 
    onSave(todo.id, editedText, todo.completed);
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

  return (
    <div className={`todo-item edit-mode`}>
      <input
        minLength={1}
        placeholder="Ваш текст..."
        type="text"
        value={editedText}
        onChange={(e) => {
          setEditedText(e.target.value);
          setError("");
        }}
        className={`edit-todo-input ${error ? "error" : ""}`}
        autoFocus
      />

      {error && (
        <div className="error-message" style={{ color: "red" }}>
          {error}
        </div>
      )}

      <div className="completedStatus">
        {todo.completed ? "Выполнено" : "Не выполнено"}
      </div>

      <div>Дата: {formatDate(todo.createdAt)}</div>

      <div className="edit-actions">
        <button onClick={handleSave} className="edit-button">
          Сохранить
        </button>
        <button
          title="отмена"
          onClick={onCancel}
          className="delete-button"
        ></button>
      </div>
    </div>
  );
};