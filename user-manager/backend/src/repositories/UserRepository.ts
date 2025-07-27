import { database } from "../db";
import { User, UserStatus } from "../models/User";

export class UserRepository {
  private pool = database.pool;

  async create(user: User): Promise<User | null> {
    const sql = `INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?)`;
    const [result]: any = await this.pool.execute(sql, [
      user.name,
      user.email,
      user.password,
      user.status,
    ]);
    if (result.insertId) {
      user.id = result.insertId;
      return user;
    }
    return null;
  }

  async findById(id: number): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE id = ? AND status != ?`;
    const [rows]: any = await this.pool.execute(sql, [id, UserStatus.DELETED]);
    if (rows.length === 0) return null;

    const row = rows[0];
    return new User(
      row.name,
      row.email,
      row.password,
      row.status,
      row.last_login,
      row.created_at,
      row.id
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE email = ? AND status != ?`;
    const [rows]: any = await this.pool.execute(sql, [
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
      row.last_login,
      row.created_at,
      row.id
    );
  }

  async update(user: User): Promise<void> {
    const sql = `
      UPDATE users
      SET name = ?, email = ?, password = ?, status = ?, last_login = ?
      WHERE id = ?
    `;
    await this.pool.execute(sql, [
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
    await this.pool.execute(sql, [date, id]);
  }

  async getAllUsersSorted(): Promise<User[]> {
    const sql = `SELECT * FROM users WHERE status != ? ORDER BY last_login DESC`;
    const [rows]: any = await this.pool.execute(sql, [UserStatus.DELETED]);
    return rows.map(
      (row: any) =>
        new User(
          row.name,
          row.email,
          row.password,
          row.status,
          row.last_login,
          row.created_at,
          row.id
        )
    );
  }

  async updateStatus(id: number, status: UserStatus): Promise<void> {
    const sql = `UPDATE users SET status = ? WHERE id = ?`;
    await this.pool.execute(sql, [status, id]);
  }

  async deleteUser(id: number): Promise<void> {
    await this.updateStatus(id, UserStatus.DELETED);
  }
}
