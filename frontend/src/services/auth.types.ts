export interface ErrorResponse {
  error: string;
  success: boolean;
}

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
}
