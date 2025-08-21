// src/pages/LoginForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Все поля обязательны");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Неверный email или пароль",
        }));
        throw new Error(errorData.error || "Неверный email или пароль");
      }

      const data = await response.json();
      login(data);
      navigate("/", { replace: true });
    } catch (rawError) {
      const message =
        rawError instanceof Error ? rawError.message : "Ошибка входа";
      setError(message);
    }
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="input-area">
        <h2>Вход</h2>

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

        {error && <div className="error-text">{error}</div>}

        <button type="submit">Войти</button>
        <button type="button" onClick={() => navigate("/register")}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
