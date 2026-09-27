import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/token';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url), 303);
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', sameSite: 'lax', maxAge: 0 });
  return response;
}
