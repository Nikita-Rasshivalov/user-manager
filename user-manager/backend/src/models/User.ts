export enum UserStatus {
  ACTIVE = 0,
  BLOCKED = 1,
  DELETED = 2,
}
export class User {
  id?: number;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  created_at: Date;
  last_login?: Date | null;

  constructor(
    name: string,
    email: string,
    password: string,
    status: UserStatus = UserStatus.ACTIVE,
    created_at?: Date,
    last_login?: Date | null,
    id?: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.status = status;
    this.created_at = created_at ?? new Date();
    this.last_login = last_login ?? null;
  }
}
