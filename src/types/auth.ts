
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'viewer';
  department?: string;
  avatar?: string;
  isSystemAdmin?: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expires_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (role: string | string[]) => boolean;
}
