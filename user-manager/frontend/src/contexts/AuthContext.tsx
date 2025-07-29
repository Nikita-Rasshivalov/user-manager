import { createContext } from "react";
import { User } from "../models/models";

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  logout: () => void;
  login: (dto: { email: string; password: string }) => Promise<void>;
  register: (dto: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
