// src/pages/RegisterForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { ApiError } from "../types/error";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<string>("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email и пароль обязательны");
      return;
    }

    if (!validateEmail(email)) {
      setError("Некорректный email");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          age: age ? Number(age) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: "Ошибка сервера",
        }));
        throw errorData;
      }

      login(data);
      navigate("/", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(message);
    }
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="input-area">
        <h2>Регистрация</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="edit-todo-input"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="edit-todo-input"
        />

        <input
          type="number"
          placeholder="Возраст (опционально)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="edit-todo-input"
        />

        {error && <div className="error-text">{error}</div>}

        <button type="submit">Зарегистрироваться</button>
        <button type="button" onClick={() => navigate("/login")}>
          Назад
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
