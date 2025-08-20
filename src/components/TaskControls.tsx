import { useState } from "react";
import { TodoFilter, DateFilter } from "../types/todo";

type TaskControlsProps = {
  onSortChange: (sortType: "newest" | "oldest") => void;
  onFilterChange: (filterType: TodoFilter) => void;
  onDateFilterChange: (dateFilter: DateFilter) => void;
};

export const TaskControls = ({ 
  onSortChange, 
  onFilterChange,
  onDateFilterChange,
 }: TaskControlsProps) => {
  const [sortType, setSortType] = useState<"newest" | "oldest">("newest");
  const [filterType, setFilterType] = useState<"all" | "completed" | "active">("all");
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

 return (
    <div className="task-controls">
      <div className="sort-controls">
        <label>Сортировка:</label>
        <select
          aria-label="Выберите тип сортировки задач"
          value={sortType}
          onChange={(e) => {
            const value = e.target.value as "newest" | "oldest";
            setSortType(value);
            onSortChange(value);
          }}
        >
          <option value="newest">Новые сначала</option>
          <option value="oldest">Старые сначала</option>
        </select>
      </div>

      <div className="filter-controls">
        <label>Статус:</label>
        <select
          aria-label="Выберите тип сортировки задач"
          value={filterType}
          onChange={(e) => {
            const value = e.target.value as "all" | "completed" | "active";
            setFilterType(value);
            onFilterChange(value);
          }}
        >
          <option value="all">Все</option>
          <option value="completed">Выполненные</option>
          <option value="active">Не выполненные</option>
        </select>
      </div>

      <div className="date-filter-controls">
        <label>Дата:</label>
        <select
          aria-label="Выберите тип сортировки задач"
          value={dateFilter}
          onChange={(e) => {
            const value = e.target.value as 'all' | 'today' | 'week' | 'month';
            setDateFilter(value);
            onDateFilterChange(value);
          }}
        >
          <option value="all">Все даты</option>
          <option value="today">Сегодня</option>
          <option value="week">Эта неделя</option>
          <option value="month">Этот месяц</option>
        </select>
      </div>
    </div>
  );
};