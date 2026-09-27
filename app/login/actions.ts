'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { authenticateUser } from '@/lib/auth/users';
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth/token';

export type LoginState = { error: string | null };

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();

function allowed(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  current.count += 1;
  return current.count <= 5;
}

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const requestedNext = String(formData.get('next') || '/dashboard');
  const nextPath = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/dashboard';
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';

  if (!email || !password) return { error: 'Enter both your email and password.' };
  if (!allowed(`${ip}:${email}`)) return { error: 'Too many attempts. Try again in 15 minutes.' };

  let user;
  try {
    user = await authenticateUser(email, password);
  } catch (error) {
    console.error('Login database error', error);
    return { error: 'Login is temporarily unavailable. Please try again.' };
  }

  if (!user) return { error: 'The email or password is incorrect.' };
  attempts.delete(`${ip}:${email}`);

  const token = await createSessionToken(user);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  redirect(nextPath);
}
