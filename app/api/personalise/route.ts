import { NextRequest, NextResponse } from 'next/server';
import { PersonalizationEngine } from '@/lib/personalization/engine';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const country = (request as any).geo?.country;
    const userAgent = request.headers.get('user-agent') || '';
    const cookieString = request.headers.get('cookie') || '';
    const pathname = request.nextUrl.searchParams.get('pathname') || '/';

    const result = PersonalizationEngine.personalize(
      country,
      userAgent,
      cookieString,
      pathname
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