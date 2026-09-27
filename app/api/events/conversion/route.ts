import { NextRequest, NextResponse } from 'next/server';
import { getCookie, COOKIES } from '@/lib/utils/cookies';
import { recordConversion } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  const userId = getCookie(COOKIES.USER_ID, request.headers.get('cookie') || '');
  if (!userId) return NextResponse.json({ success: false }, { status: 400 });
  const body = await request.json().catch(() => ({}));
  const goal = typeof body.goal === 'string' ? body.goal : 'primary-cta';
  await recordConversion(userId, typeof body.ruleId === 'string' ? body.ruleId : null, typeof body.variantId === 'string' ? body.variantId : null, goal);
  return NextResponse.json({ success: true });
}
