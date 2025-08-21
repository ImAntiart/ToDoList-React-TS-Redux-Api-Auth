import { useEffect, createContext, useContext, useState } from "react";
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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (data: AuthResponse) => {
    const { accessToken, refreshToken } = data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setToken(accessToken);
    setIsAuthenticated(true);
    dispatch(loginSuccess({ user: null, token: accessToken, refreshToken }));
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    dispatch(logoutAction());
  };

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
      }
    })();
  }, [dispatch, handleLogout]);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};