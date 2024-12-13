import { getDb } from '../db.js';
import { createToken } from '../utils/jwt.js';
import { hashPassword, comparePasswords } from '../utils/crypto.js';
import { AppError } from '../utils/errors.js';

export class AuthService {
  static async login({ email, password }) {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = await createToken(user);
    return { token, user: { ...user, password: undefined } };
  }

  static async register({ email, password, name }) {
    const db = getDb();
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await hashPassword(password);
    const result = db.prepare(`
      INSERT INTO users (id, email, name, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), email, name, hashedPassword, 'staff');

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    return { ...user, password: undefined };
  }
}