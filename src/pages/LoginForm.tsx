// src/pages/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Все поля обязательны');
      return;
    }

    try {
      const data = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(res => {
        if (!res.ok) throw new Error('Неверный email или пароль');
        return res.json();
      });

      login(data); // Сохраняем токены и обновляем состояние
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
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
      </form>
    </div>
  );
};

export default LoginForm;