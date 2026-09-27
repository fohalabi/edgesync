import 'server-only';
import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';
import { personalizationConfig } from '@/config/personalization';
import type { ContentVariant, RuleGroup, SegmentRule } from '@/lib/types';

export type StoredRule = {
  id: string; slug: string; name: string; priority: number; enabled: boolean; status: 'draft' | 'published';
  isFallback: boolean; expression: RuleGroup; content: ContentVariant['content']; updatedAt: string; publishedAt: string | null;
};

let cache: { expires: number; rules: SegmentRule[]; variants: ContentVariant[] } | null = null;
export function invalidateRuleCache() { cache = null; }

function mapRow(row: Record<string, unknown>): StoredRule {
  return { id: String(row.id), slug: String(row.slug), name: String(row.name), priority: Number(row.priority), enabled: Boolean(row.enabled), status: row.status as 'draft' | 'published', isFallback: Boolean(row.is_fallback), expression: row.expression as RuleGroup, content: row.content as ContentVariant['content'], updatedAt: new Date(String(row.updated_at)).toISOString(), publishedAt: row.published_at ? new Date(String(row.published_at)).toISOString() : null };
}

export async function listRules() { const result = await db.query('SELECT * FROM rules ORDER BY priority DESC, updated_at DESC'); return result.rows.map(mapRow); }
export async function getRule(id: string) { const result = await db.query('SELECT * FROM rules WHERE id = $1', [id]); return result.rows[0] ? mapRow(result.rows[0]) : null; }
export async function getRuleVersions(id: string) { const result = await db.query('SELECT id, version, snapshot, created_at FROM rule_versions WHERE rule_id = $1 ORDER BY version DESC', [id]); return result.rows; }

export async function saveRule(input: Omit<StoredRule, 'updatedAt' | 'publishedAt'>, userId: string) {
  const id = input.id || randomUUID();
  const publishedSnapshot = JSON.stringify({ slug: input.slug, name: input.name, priority: input.priority, enabled: input.enabled, isFallback: input.isFallback, expression: input.expression, content: input.content });
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(`INSERT INTO rules (id, slug, name, priority, enabled, status, is_fallback, expression, content, created_by, published_at, published_snapshot)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CASE WHEN $6 = 'published' THEN NOW() ELSE NULL END,CASE WHEN $6='published' THEN $11::jsonb ELSE NULL END)
      ON CONFLICT (id) DO UPDATE SET slug=$2,name=$3,priority=$4,enabled=$5,status=$6,is_fallback=$7,expression=$8,content=$9,updated_at=NOW(),published_at=CASE WHEN $6='published' THEN COALESCE(rules.published_at,NOW()) ELSE rules.published_at END,published_snapshot=CASE WHEN $6='published' THEN $11::jsonb ELSE rules.published_snapshot END RETURNING *`,
      [id, input.slug, input.name, input.priority, input.enabled, input.status, input.isFallback, JSON.stringify(input.expression), JSON.stringify(input.content), userId, publishedSnapshot]);
    const versionResult = await client.query('SELECT COALESCE(MAX(version), 0) + 1 AS next FROM rule_versions WHERE rule_id=$1', [id]);
    await client.query('INSERT INTO rule_versions (rule_id, version, snapshot, created_by) VALUES ($1,$2,$3,$4)', [id, Number(versionResult.rows[0].next), JSON.stringify(mapRow(result.rows[0])), userId]);
    await client.query('COMMIT'); invalidateRuleCache(); return mapRow(result.rows[0]);
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function deleteRule(id: string) { await db.query('DELETE FROM rules WHERE id=$1', [id]); invalidateRuleCache(); }
export async function duplicateRule(id: string, userId: string) { const source = await getRule(id); if (!source) throw new Error('Rule not found'); return saveRule({ ...source, id: '', slug: `${source.slug}-copy-${Date.now().toString(36)}`, name: `${source.name} copy`, status: 'draft' }, userId); }

export async function getPublishedRuntimeConfig() {
  if (cache && cache.expires > Date.now()) return cache;
  try {
    const result = await db.query("SELECT published_snapshot FROM rules WHERE published_at IS NOT NULL AND published_snapshot IS NOT NULL ORDER BY ((published_snapshot->>'priority')::int) DESC");
    if (!result.rowCount) return { expires: Date.now() + 10_000, rules: personalizationConfig.segments, variants: personalizationConfig.variants };
    const stored = result.rows.map((row) => row.published_snapshot as { slug:string; name:string; priority:number; enabled:boolean; isFallback:boolean; expression:RuleGroup; content:ContentVariant['content'] }).filter((rule) => rule.enabled);
    cache = { expires: Date.now() + 30_000, rules: stored.map((r) => ({ id: r.slug, name: r.name, priority: r.priority, enabled: r.enabled, fallback: r.isFallback, expression: r.expression })), variants: stored.map((r) => ({ id: `${r.slug}-variant`, segment: r.slug, content: r.content })) };
    return cache;
  } catch { return { expires: Date.now() + 5_000, rules: personalizationConfig.segments, variants: personalizationConfig.variants }; }
}
