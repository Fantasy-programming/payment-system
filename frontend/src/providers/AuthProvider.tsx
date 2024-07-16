import axios from "axios";
import { useState, useEffect, createContext, useCallback } from "react";
import { AuthResponse } from "@/services/auth.types";
import { AuthContext, AuthProviderProps } from "./AuthProvider.types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isTokenExpired } from "@/lib/utils";

export const Context = createContext<null | AuthContext>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthResponse>({
    token: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (isTokenExpired(parsedUser.token)) {
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        return;
      }

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${parsedUser.token}`;
      setUser(parsedUser);
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    setLoading(false);
  }, []);

  const storeUser = useCallback((newJwt: AuthResponse) => {
    const toStore = JSON.stringify(newJwt);
    localStorage.setItem("user", toStore);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newJwt.token}`;
    setUser(newJwt);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Context.Provider value={{ user, storeUser }}>{children}</Context.Provider>
  );
};
