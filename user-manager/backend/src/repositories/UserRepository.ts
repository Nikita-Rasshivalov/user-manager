import { database } from "../db";
import { User, UserStatus } from "../models/User";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  created_at: Date;
  last_login: Date | null;
}

export class UserRepository {
  private pool = database.pool;

  async create(user: User): Promise<User | null> {
    const sql = `INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?)`;
    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, [
        user.name,
        user.email,
        user.password,
        user.status,
      ]);
      user.id = result.insertId;
      return user;
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new Error("Email already registered");
      }
      throw err;
    }
  }

  async findById(id: number): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE id = ? AND status != ?`;
    const [rows] = await this.pool.execute<UserRow[]>(sql, [
      id,
      UserStatus.DELETED,
    ]);
    if (rows.length === 0) return null;

    const row = rows[0];
    return new User(
      row.name,
      row.email,
      row.password,
      row.status,
      row.created_at,
      row.last_login,
      row.id
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE email = ? AND status != ?`;
    const [rows] = await this.pool.execute<UserRow[]>(sql, [
      email,
      UserStatus.DELETED,
    ]);
    if (rows.length === 0) return null;

    const row = rows[0];
    return new User(
      row.name,
      row.email,
      row.password,
      row.status,
      row.created_at,
      row.last_login,
      row.id
    );
  }

  async update(user: User): Promise<void> {
    const sql = `
      UPDATE users
      SET name = ?, email = ?, password = ?, status = ?, last_login = ?
      WHERE id = ?
    `;
    await this.pool.execute<ResultSetHeader>(sql, [
      user.name,
      user.email,
      user.password,
      user.status,
      user.last_login,
      user.id,
    ]);
  }

  async updateLastLogin(id: number, date: Date): Promise<void> {
    const sql = `UPDATE users SET last_login = ? WHERE id = ?`;
    await this.pool.execute<ResultSetHeader>(sql, [date, id]);
  }

  async getAllUsersSorted(): Promise<User[]> {
    const sql = `SELECT * FROM users WHERE status != ? ORDER BY last_login DESC`;
    const [rows] = await this.pool.execute<UserRow[]>(sql, [
      UserStatus.DELETED,
    ]);
    return rows.map(
      (row) =>
        new User(
          row.name,
          row.email,
          row.password,
          row.status,
          row.created_at,
          row.last_login,
          row.id
        )
    );
  }

  async updateStatus(id: number, status: UserStatus): Promise<void> {
    const sql = `UPDATE users SET status = ? WHERE id = ?`;
    await this.pool.execute<ResultSetHeader>(sql, [status, id]);
  }

  async deleteUser(id: number): Promise<void> {
    await this.updateStatus(id, UserStatus.DELETED);
  }

  async updateStatusBulk(ids: number[], status: UserStatus): Promise<void> {
    if (ids.length === 0) return;
    const placeholders = ids.map(() => "?").join(",");
    const sql = `UPDATE users SET status = ? WHERE id IN (${placeholders})`;
    await this.pool.execute<ResultSetHeader>(sql, [status, ...ids]);
  }
}
