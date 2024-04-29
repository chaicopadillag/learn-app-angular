export interface AuthResponse {
  authUser: AuthUser;
  token: string;
}

export interface AuthUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  status: number;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'verifying';

export interface VerifyTokenResponse {
  data: AuthUser;
}
