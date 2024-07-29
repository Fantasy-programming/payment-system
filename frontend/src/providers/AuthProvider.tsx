import { useState, useEffect, createContext, useCallback } from "react";

import axios from "@/lib/axios";
import { isTokenExpired } from "@/lib/utils";

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
    delete axios.defaults.headers.common["Authorization"];
    setUser({ token: "", email: "", role: "" });
  }, []);

  const storeUser = useCallback((newJwt: AuthResponse) => {
    const toStore = JSON.stringify(newJwt);
    localStorage.setItem("user", toStore);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newJwt.token}`;
    setUser(newJwt);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (isTokenExpired(parsedUser.token)) {
        logout();
        return;
      }

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${parsedUser.token}`;
      setUser(parsedUser);
    } else {
      logout();
    }

    setLoading(false);
  }, [logout]);

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
