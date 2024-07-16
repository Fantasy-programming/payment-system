import { AuthResponse } from "@/services/auth.types";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthContext {
  user: AuthResponse;
  storeUser: (newJwt: AuthResponse) => void;
}
