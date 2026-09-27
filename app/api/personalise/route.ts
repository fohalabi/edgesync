import { NextRequest, NextResponse } from 'next/server';
import { PersonalizationEngine } from '@/lib/personalization/engine';
import type { PersonalizationOverrides } from '@/lib/types';

declare module 'next/server' {
  interface NextRequest {
    geo?: {
      country?: string;
    };
  }
}

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const country = request.geo?.country || request.headers.get('x-vercel-ip-country') || undefined;
    const userAgent = request.headers.get('user-agent') || '';
    const cookieString = request.headers.get('cookie') || '';
    const pathname = request.nextUrl.searchParams.get('pathname') || '/';
    const countryOverride = request.nextUrl.searchParams.get('country')?.toUpperCase();
    const deviceOverride = request.nextUrl.searchParams.get('device');
    const visitorOverride = request.nextUrl.searchParams.get('visitor');
    const languageOverride = request.nextUrl.searchParams.get('language')?.toLowerCase();
    const hourOverride = Number(request.nextUrl.searchParams.get('hour'));
    const referrerOverride = request.nextUrl.searchParams.get('referrer');
    const networkOverride = request.nextUrl.searchParams.get('network');
    const overrides: PersonalizationOverrides = {};

    if (countryOverride && /^[A-Z]{2}$/.test(countryOverride)) overrides.country = countryOverride;
    if (deviceOverride === 'mobile' || deviceOverride === 'tablet' || deviceOverride === 'desktop') overrides.device = deviceOverride;
    if (visitorOverride === 'new' || visitorOverride === 'returning') overrides.visitor = visitorOverride;
    if (languageOverride && /^[a-z]{2}$/.test(languageOverride)) overrides.language = languageOverride;
    if (Number.isInteger(hourOverride) && hourOverride >= 0 && hourOverride <= 23) overrides.localHour = hourOverride;
    if (referrerOverride === 'direct' || referrerOverride === 'search' || referrerOverride === 'social' || referrerOverride === 'campaign') overrides.referrer = referrerOverride;
    if (networkOverride === 'fast' || networkOverride === 'standard' || networkOverride === 'slow') overrides.network = networkOverride;

    const result = PersonalizationEngine.personalize(
      country,
      userAgent,
      cookieString,
      pathname,
      overrides
    );

    return NextResponse.json({
      success: true,
      data: {
        segment: result.segment,
        variant: result.variant,
        experimentVariant: result.experimentVariant,
        decision: result.decision,
      },
    });
  } catch (error) {
    console.error('Personalization API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to personalize',
      },
      { status: 500 }
    );
  }
}
