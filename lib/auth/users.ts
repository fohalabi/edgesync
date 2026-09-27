import 'server-only';
import { compare } from 'bcryptjs';
import { db } from '@/lib/db';
import type { SessionUser } from './token';

type UserRow = SessionUser & { password_hash: string };

export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await db.query<UserRow>(
    `SELECT id, email, name, password_hash
     FROM users
     WHERE email = $1 AND active = true
     LIMIT 1`,
    [normalizedEmail]
  );
  const user = result.rows[0];
  if (!user || !(await compare(password, user.password_hash))) return null;
  return { id: user.id, email: user.email, name: user.name };
}
