
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PersonalizationEngine } from '@/lib/personalization/engine';
import { getCookie, generateUserId, COOKIES } from '@/lib/utils/cookies';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const country = (request as any).geo?.country;
  const userAgent = request.headers.get('user-agent') || '';
  const cookieString = request.headers.get('cookie') || '';
  const pathname = request.nextUrl.pathname;

  const result = PersonalizationEngine.personalize(
    country,
    userAgent,
    cookieString,
    pathname
  );

  const userId = getCookie(COOKIES.USER_ID, cookieString) || generateUserId();

  const cookiesToSet = PersonalizationEngine.getCookiesToSet(result, userId);
  
  Object.entries(cookiesToSet).forEach(([name, value]) => {
    response.cookies.set({
      name,
      value,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
  });

  response.headers.set('x-segment-id', result.segment.id);
  response.headers.set('x-variant-id', result.variant.id);
  
  if (result.experimentVariant) {
    response.headers.set('x-experiment-variant', result.experimentVariant);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};