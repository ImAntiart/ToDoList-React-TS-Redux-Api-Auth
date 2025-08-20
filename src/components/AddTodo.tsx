import { useState } from "react";
import { TodoFilter } from "../types/todo";
import { PaginationControls } from "./PaginationControls";

type Props = {
  onAdd: (text: string) => void;
  onFilterChange: (filter: TodoFilter) => void;
  onSortChange: (sortOrder: "newest" | "oldest") => void;
};

export const AddTodo = ({
  onAdd,
  onFilterChange,
  onSortChange,
}: Props) => {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!inputText.trim()) {
      setError("Поле не может быть пустым");
      return;
    }
    if (inputText.length > 50) {
      setError("Максимум 50 символов");
      return;
    }
    onAdd(inputText);
    setInputText("");
    setError("");
  };

  return (
    <>
    <aside>
        <div className="input-area">
      <input
        maxLength={50}
        type="text"
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          setError("");
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Новая задача..."
        className={error ? "error-border" : ""}
      />
      {error && <div className="error-text">{error}</div>}
      <button onClick={handleSubmit}>Добавить</button>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Статус:</label>
          <select
           title="выберите критерий сортировки"
        onChange={(e) => onFilterChange(e.target.value as TodoFilter)}
          >
            <option value="">Выберите фильтр</option>
            <option value="all">Все</option>
            <option value="completed">Выполненные</option>
            <option value="active">Не выполненные</option>
          </select>
        </div>

        <div className="filter-group-date">
          <label>Сортировка:</label>
          <select
            title="выберите критерий сортировки"
            onChange={(e) =>
              onSortChange(e.target.value as "newest" | "oldest")
            }
          >
            <option value="newest">Новые сначала</option>
            <option value="oldest">Старые сначала</option>
          </select>
        </div>
      </div>
      
    </div>
    <PaginationControls />
    </aside>

    </>
  );
};
