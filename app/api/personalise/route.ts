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
    const overrides: PersonalizationOverrides = {};

    if (countryOverride && /^[A-Z]{2}$/.test(countryOverride)) overrides.country = countryOverride;
    if (deviceOverride === 'mobile' || deviceOverride === 'tablet' || deviceOverride === 'desktop') overrides.device = deviceOverride;
    if (visitorOverride === 'new' || visitorOverride === 'returning') overrides.visitor = visitorOverride;

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
