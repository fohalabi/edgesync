import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from './token';

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}
