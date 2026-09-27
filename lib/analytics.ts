import 'server-only';
import { createHash } from 'node:crypto';
import { db } from '@/lib/db';
import type { PersonalizationResult } from '@/lib/types';

export function anonymousVisitorId(id: string) { return createHash('sha256').update(id).digest('hex').slice(0, 40); }

export async function recordImpression(result: PersonalizationResult, latencyMs: number) {
  await db.query(`INSERT INTO events (event_type,visitor_id,rule_id,variant_id,country,device,language,referrer,network,latency_ms)
    VALUES ('impression',$1,$2,$3,$4,$5,$6,$7,$8,$9)`, [anonymousVisitorId(result.userId), result.segment.id, result.variant.id, result.segment.country, result.segment.device, result.segment.language, result.segment.referrer, result.segment.network, latencyMs]);
}

export async function recordConversion(visitorId: string, ruleId: string | null, variantId: string | null, goal: string) {
  await db.query(`INSERT INTO events (event_type,visitor_id,rule_id,variant_id,goal)
    SELECT 'conversion',$1,$2,$3,$4 WHERE NOT EXISTS (
      SELECT 1 FROM events WHERE event_type='conversion' AND visitor_id=$1 AND goal=$4 AND created_at>NOW()-INTERVAL '24 hours'
    )`, [anonymousVisitorId(visitorId), ruleId, variantId, goal.slice(0, 120)]);
}

export type DashboardAnalytics = {
  totals: { visitors: number; impressions: number; conversions: number; conversionRate: number; avgLatency: number; p95Latency: number; regions: number };
  regions: Array<{ region: string; users: number; latency: number; flag: string }>;
  segments: Array<{ name: string; count: number; percentage: number; color: string }>;
  requests: Array<{ time: string; requests: number }>;
  logs: Array<{ id: number; time: string; user: string; location: string; rule: string; latency: string }>;
};

const colors = ['bg-[#76f7b2]', 'bg-blue-500', 'bg-orange-500', 'bg-violet-500', 'bg-rose-500'];
function flag(code: string) { return /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((char) => 127397 + char.charCodeAt(0))) : '🌐'; }

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const [totals, regions, segments, requests, logs] = await Promise.all([
    db.query(`SELECT COUNT(*) FILTER (WHERE event_type='impression')::int impressions, COUNT(DISTINCT visitor_id) FILTER (WHERE event_type='impression')::int visitors, COUNT(*) FILTER (WHERE event_type='conversion')::int conversions, COALESCE(AVG(latency_ms) FILTER (WHERE event_type='impression'),0)::int avg_latency, COALESCE(PERCENTILE_CONT(.95) WITHIN GROUP (ORDER BY latency_ms) FILTER (WHERE event_type='impression'),0)::int p95_latency, COUNT(DISTINCT country) FILTER (WHERE event_type='impression')::int regions FROM events WHERE created_at > NOW() - INTERVAL '30 days'`),
    db.query(`SELECT country, COUNT(DISTINCT visitor_id)::int users, COALESCE(AVG(latency_ms),0)::int latency FROM events WHERE event_type='impression' AND created_at > NOW()-INTERVAL '30 days' GROUP BY country ORDER BY users DESC LIMIT 6`),
    db.query(`SELECT rule_id, COUNT(*)::int count FROM events WHERE event_type='impression' AND created_at > NOW()-INTERVAL '30 days' GROUP BY rule_id ORDER BY count DESC LIMIT 6`),
    db.query(`SELECT TO_CHAR(bucket,'HH24:MI') time, count(e.id)::int requests FROM generate_series(date_trunc('hour',NOW())-INTERVAL '5 hours',date_trunc('hour',NOW()),INTERVAL '1 hour') bucket LEFT JOIN events e ON e.event_type='impression' AND e.created_at>=bucket AND e.created_at<bucket+INTERVAL '1 hour' GROUP BY bucket ORDER BY bucket`),
    db.query(`SELECT id,created_at,visitor_id,country,rule_id,latency_ms FROM events WHERE event_type='impression' ORDER BY created_at DESC LIMIT 10`),
  ]);
  const totalRow = totals.rows[0]; const impressionCount = Number(totalRow.impressions); const conversionCount = Number(totalRow.conversions);
  return {
    totals: { visitors: Number(totalRow.visitors), impressions: impressionCount, conversions: conversionCount, conversionRate: impressionCount ? Math.round((conversionCount / impressionCount) * 1000) / 10 : 0, avgLatency: Number(totalRow.avg_latency), p95Latency: Number(totalRow.p95_latency), regions: Number(totalRow.regions) },
    regions: regions.rows.map((row) => ({ region: row.country || 'Unknown', users: Number(row.users), latency: Number(row.latency), flag: flag(row.country || '') })),
    segments: segments.rows.map((row, index) => ({ name: row.rule_id || 'Unknown', count: Number(row.count), percentage: impressionCount ? Math.round(Number(row.count) / impressionCount * 100) : 0, color: colors[index % colors.length] })),
    requests: requests.rows.map((row) => ({ time: row.time, requests: Number(row.requests) })),
    logs: logs.rows.map((row) => ({ id: Number(row.id), time: new Date(row.created_at).toLocaleTimeString('en-US', { hour12: false }), user: `0x${String(row.visitor_id).slice(0, 6).toUpperCase()}`, location: row.country || 'Unknown', rule: row.rule_id || 'fallback', latency: `${Number(row.latency_ms || 0)}ms` })),
  };
}
