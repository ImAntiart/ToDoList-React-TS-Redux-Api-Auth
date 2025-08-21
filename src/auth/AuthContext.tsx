// src/auth/AuthContext.tsx
import { createContext, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { loginSuccess, logout as logoutAction, setProfile } from "./authSlice";
import {
  AuthResponse,
  User,
  fetchProfile,
  refreshTokens,
} from "./services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Исправление 1: правильный параметр
  const login = async (data: AuthResponse) => {
    const { accessToken, refreshToken } = data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setToken(accessToken);
    setIsAuthenticated(true);
    dispatch(loginSuccess({ user: null, token: accessToken, refreshToken }));

    try {
      const profile = await fetchProfile(accessToken);
      setUser(profile);
      dispatch(setProfile(profile));
    } catch (err) {
      console.error("Не удалось загрузить профиль:", err);
      handleLogout();
    }
  };

  // ✅ Исправление 2: оберни handleLogout в useCallback
  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    dispatch(logoutAction());
  }, [dispatch]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const profile = await fetchProfile(accessToken);
        setUser(profile);
        setToken(accessToken);
        setIsAuthenticated(true);
        dispatch(loginSuccess({ user: profile, token: accessToken, refreshToken }));
        dispatch(setProfile(profile));
      } catch (rawError) {
        console.warn('Не удалось восстановить сессию:', rawError);

        try {
          const newTokens = await refreshTokens(refreshToken);
          localStorage.setItem("accessToken", newTokens.accessToken);
          localStorage.setItem("refreshToken", newTokens.refreshToken);

          const profile = await fetchProfile(newTokens.accessToken);
          setUser(profile);
          setToken(newTokens.accessToken);
          setIsAuthenticated(true);

          dispatch(loginSuccess({
            user: profile,
            token: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          }));
          dispatch(setProfile(profile));
        } catch (refreshError) {
          console.error('Не удалось обновить токен:', refreshError);
          handleLogout();
        } finally {
          setIsLoading(false);
        }
        return;
      }
      setIsLoading(false);
    })();
  }, [dispatch, handleLogout]); 

  return (
    <AuthContext.Provider value={{
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
