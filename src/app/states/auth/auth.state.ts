export interface Error {
  errorCode: number;
  message: string;
}

export interface User {
  email: string;
  phone: string;
  userName: string;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthState {
  isLogin: boolean;
  loading: boolean;
  error?: Error;
  user?: User;
}

export const initAuthState: AuthState = {
  isLogin: false,
  loading: false,
  error: undefined,
  user: undefined,
};
