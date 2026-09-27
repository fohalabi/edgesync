import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PersonalizationEngine } from '@/lib/personalization/engine';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/token';

declare module 'next/server' {
  interface NextRequest {
    geo?: { country?: string };
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionToken ? await verifySessionToken(sessionToken) : null;

  if (pathname.startsWith('/dashboard') && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && session) return NextResponse.redirect(new URL('/dashboard', request.url));

  const response = NextResponse.next();
  const country = request.geo?.country || request.headers.get('x-vercel-ip-country') || undefined;
  const result = PersonalizationEngine.personalize(
    country,
    request.headers.get('user-agent') || '',
    request.headers.get('cookie') || '',
    pathname
  );

  Object.entries(PersonalizationEngine.getCookiesToSet(result)).forEach(([name, value]) => {
    response.cookies.set({
      name,
      value,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      httpOnly: name === 'user-id',
      secure: process.env.NODE_ENV === 'production',
    });
  });

  response.headers.set('x-segment-id', result.segment.id);
  response.headers.set('x-variant-id', result.variant.id);
  if (result.experimentVariant) response.headers.set('x-experiment-variant', result.experimentVariant);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)'],
};
