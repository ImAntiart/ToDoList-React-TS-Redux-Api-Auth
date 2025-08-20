// src/auth/useAuth.ts
import { useEffect, createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout as logoutAction, setProfile } from "./authSlice";
import {
  AuthResponse,
  User,
  fetchProfile,
  refreshTokens,
} from "./services/authService";

// Интерфейс для контекста
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isLoading: boolean;
}

// Создаём контекст
const AuthContext = createContext<AuthContextType | null>(null);

// Провайдер авторизации
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Функция входа
  const login = (data: AuthResponse) => {
    const { accessToken, refreshToken } = data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setToken(accessToken);
    setIsAuthenticated(true);
    dispatch(loginSuccess({ user: null, token: accessToken, refreshToken }));
  };

  // Функция выхода
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    dispatch(logoutAction()); // ← используем экшен
  };

  // Автоматическая авторизация при загрузке
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      setIsLoading(false);
      return;
    }

    // Функция для восстановления сессии
    const restoreSession = async () => {
      try {
        // Сначала получим профиль
        const profile = await fetchProfile(accessToken);
        setUser(profile);
        setToken(accessToken);
        setIsAuthenticated(true);

        // Сохраним в Redux
        dispatch(
          loginSuccess({ user: profile, token: accessToken, refreshToken })
        );
        dispatch(setProfile(profile));
      } catch (err: any) {
        console.warn("Не удалось восстановить сессию:", err.message);

        // Если токен просрочен — попробуем обновить
        try {
          const newTokens = await refreshTokens(refreshToken);
          localStorage.setItem("accessToken", newTokens.accessToken);
          localStorage.setItem("refreshToken", newTokens.refreshToken);

          const profile = await fetchProfile(newTokens.accessToken);
          setUser(profile);
          setToken(newTokens.accessToken);
          setIsAuthenticated(true);

          dispatch(
            loginSuccess({
              user: profile,
              token: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
            })
          );
          dispatch(setProfile(profile));
        } catch (refreshErr: any) {
          console.error("Не удалось обновить токен:", refreshErr.message);
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout: handleLogout, 
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования в компонентах
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
