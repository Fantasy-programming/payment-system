import { AuthResponse } from "@/services/auth";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthContext {
  user: AuthResponse;
  storeUser: (newJwt: AuthResponse) => void;
}
