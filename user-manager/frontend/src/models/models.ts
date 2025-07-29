export enum UserStatus {
  ACTIVE = 0,
  BLOCKED = 1,
  DELETED = 2,
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  created_at: string;
  last_login: string | null;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  status: number;
  last_login: string | null;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}
