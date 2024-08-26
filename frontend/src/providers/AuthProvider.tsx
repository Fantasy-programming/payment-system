import authService from "@/services/auth";
import { useState, useEffect, createContext, useCallback } from "react";
import { initAPI } from "@/lib/axios";

import { AuthResponse } from "@/services/auth.types";
import { AuthContext, AuthProviderProps } from "./AuthProvider.types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const Context = createContext<null | AuthContext>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<AuthResponse>({
    token: "",
    email: "",
    role: "",
  });

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    authService.logout();
    setUser({ token: "", email: "", role: "" });
  }, []);

  const storeUser = useCallback((newJwt: AuthResponse) => {
    const toStore = JSON.stringify(newJwt);
    localStorage.setItem("user", toStore);
    setUser(newJwt);
  }, []);

  const refreshToken = useCallback(async () => {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) logout();

    const data: AuthResponse = await response.json();
    storeUser(data);

    return data.token;
  }, [storeUser, logout]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    // Initialize the API with refreshToken and logout functions
    initAPI(refreshToken, logout);

    setLoading(false);
  }, [logout, refreshToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Context.Provider value={{ user, storeUser, logout }}>
      {children}
    </Context.Provider>
  );
};
