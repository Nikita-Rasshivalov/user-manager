import React, { useCallback, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "./AuthContext";
import { clearAuthData, getToken, saveToken } from "../utils/tokenUtils";
import { AuthApi } from "../api/authApi";
import { User } from "../models/models";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          setLoading(true);
          const currentUser = await AuthApi.getCurrentUser();
          setToken(token);
          setUser(currentUser);
        } catch {
          clearAuthData();
          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
          setInitializing(false);
        }
      } else {
        setInitializing(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (dto: { email: string; password: string }) => {
      setLoading(true);
      try {
        const { token, user } = await AuthApi.login(dto);
        saveToken(token);
        setToken(token);
        setUser(user);
        navigate("/dashboard");
      } catch (err: any) {
        const message =
          err?.response?.data?.error || err?.message || "Login failed";
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (dto: { name: string; email: string; password: string }) => {
      await AuthApi.register(dto);
      await login({ email: dto.email, password: dto.password });
    },
    [login]
  );

  const logout = useCallback(() => {
    clearAuthData();
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const value: AuthContextType = {
    token,
    user,
    loading: loading || initializing,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};
