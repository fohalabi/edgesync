import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'EdgeSync Admin' } = process.env;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not configured');
if (!ADMIN_EMAIL || !ADMIN_EMAIL.includes('@')) throw new Error('ADMIN_EMAIL must be a valid email');
if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters');

const client = new pg.Client({ connectionString: DATABASE_URL });
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

try {
  await client.connect();
  await client.query(
    `INSERT INTO users (id, email, name, password_hash)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       name = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       active = TRUE,
       updated_at = NOW()`,
    [randomUUID(), ADMIN_EMAIL.trim().toLowerCase(), ADMIN_NAME.trim(), passwordHash]
  );
  console.log(`Admin account ready for ${ADMIN_EMAIL.trim().toLowerCase()}`);
} finally {
  await client.end();
}
