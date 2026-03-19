// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  username?: string;
  error?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
}
