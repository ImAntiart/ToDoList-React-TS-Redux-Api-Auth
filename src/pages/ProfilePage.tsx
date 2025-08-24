import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { changePassword } from "../auth/services/authService";
import { ThemeProvider } from "../components/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, token } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Новые пароли не совпадают");
      return;
    }

    if (newPassword.length < 6) {
      setError("Новый пароль должен быть не менее 6 символов");
      return;
    }

    if (!token) {
      setError("Токен отсутствует");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword, token);
      setSuccess("Пароль успешно изменён");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (rawError) {
      const message =
        rawError instanceof Error
          ? rawError.message
          : "Ошибка при смене пароля";
      setError(message);
    }
  };

  if (!user) {
    return <div>Загрузка профиля...</div>;
  }

  return (
    <ThemeProvider>
      <ThemeToggle />
      <div className="form-page">
        <div className="input-area">
          <h2>Профиль</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Возраст:</strong> {user.age || "Не указан"}
          </p>
          <p>
            <strong>Дата регистрации:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <hr />

          <button type="button" onClick={() => navigate("/")}>
            Назад
          </button>

          <hr />

          <h3>Смена пароля</h3>
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              placeholder="Старый пароль"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="edit-todo-input"
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="edit-todo-input"
            />
            <input
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="edit-todo-input"
            />
            {error && <div className="error-text">{error}</div>}
            {success && <div style={{ color: "green" }}>{success}</div>}

            <hr />

            <button type="submit">Сменить пароль</button>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProfilePage;
