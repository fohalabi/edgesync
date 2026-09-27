import { NextRequest, NextResponse } from 'next/server';
import { getCookie, COOKIES } from '@/lib/utils/cookies';
import { recordConversion } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  if (request.headers.get('x-edgesync-analytics') !== 'granted') return NextResponse.json({ success: true, recorded: false });
  const userId = getCookie(COOKIES.USER_ID, request.headers.get('cookie') || '');
  if (!userId) return NextResponse.json({ success: false }, { status: 400 });
  const body = await request.json().catch(() => ({}));
  const goal = typeof body.goal === 'string' && body.goal.trim() ? body.goal.trim().slice(0, 120) : 'primary-cta';
  await recordConversion(userId, typeof body.ruleId === 'string' ? body.ruleId : null, typeof body.variantId === 'string' ? body.variantId : null, goal, typeof body.experimentId==='string'?body.experimentId:null, typeof body.experimentVariant==='string'?body.experimentVariant:null);
  return NextResponse.json({ success: true, recorded: true }, { headers: { 'Cache-Control': 'no-store' } });
}
