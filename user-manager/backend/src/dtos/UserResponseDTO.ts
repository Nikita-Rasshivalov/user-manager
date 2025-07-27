export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  status: number;
  last_login: Date | null;
  created_at: Date;
}
