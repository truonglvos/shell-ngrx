export interface Error {
  errorCode: number;
  message: string;
}

export interface User {
  email: string;
  phone: string;
  username: string;
  accessToken: string;
  refreshToken?: string;
  roles: {
    roleDescEN: string;
    roleId: number;
  }[];
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
