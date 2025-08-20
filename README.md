1. Управление темами
Механизм: Используется Context API + localStorage для сохранения выбранной темы

Особенности:
Тема сохраняется при перезагрузке (localStorage)
Динамически добавляется класс на documentElement (light-theme/dark-theme)
Переключение через кнопку ThemeToggle (стилизованную через styled-components)

2. Работа с задачами
Сериализация: Даты конвертируются в ISO-строки для localStorage
Защита: Обработка ошибок парсинга в loadTodos()
Типизация: Чёткое разделение типов Todo и StoredTodo

3. Стилевой подход
Комбинация:
CSS-переменные (через var(--note-button-bg))
styled-components для динамических элементов
Классовые модификаторы (light-theme/dark-theme)

4. Поток данных
Добавление: AddTodo → App → saveTodos(localStorage)
Редактирование: EditTodo → TodoList → App → сохранение
Темы: ThemeToggle → ThemeContext → обновление DOM и localStorage