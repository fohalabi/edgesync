'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { deleteRule, duplicateRule, saveRule } from '@/lib/rules/store';
import type { RuleGroup } from '@/lib/types';
import { recordAudit } from '@/lib/audit';

type Payload = { id?: string; slug: string; name: string; priority: number; enabled: boolean; isFallback: boolean; status: 'draft' | 'published'; expression: RuleGroup; content: { headline: string; subheadline: string; cta: string; theme?: 'default' | 'premium' | 'casual' } };
export type SaveRuleState = { error: string | null };

function validate(value: unknown): Payload {
  const input = value as Payload;
  if (!input || !/^[a-z0-9-]{2,120}$/.test(input.slug) || !input.name?.trim()) throw new Error('A name and lowercase URL-safe slug are required');
  if (!input.content?.headline?.trim() || !input.content?.subheadline?.trim() || !input.content?.cta?.trim()) throw new Error('Complete all content fields');
  if (!input.expression || !['and', 'or'].includes(input.expression.combinator) || !Array.isArray(input.expression.items)) throw new Error('Invalid rule expression');
  return input;
}

export async function saveRuleAction(_: SaveRuleState, formData: FormData): Promise<SaveRuleState> {
  const session = await getSession(); if (!session) redirect('/login');
  try {
    const payload = validate(JSON.parse(String(formData.get('payload') || '{}')));
    const intent = String(formData.get('intent') || 'draft');
    payload.status = intent === 'publish' ? 'published' : 'draft';
    const saved = await saveRule({ ...payload, id: payload.id || '' }, session.id);
    await recordAudit(session.id, intent === 'publish' ? 'rule.published' : 'rule.saved', 'rule', saved.id, { name: saved.name, slug: saved.slug });
    revalidatePath('/dashboard'); revalidatePath('/dashboard/rules');
    redirect(`/dashboard/rules/${saved.id}?saved=${intent}`);
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') return { error: 'That slug is already used by another rule.' };
    return { error: error instanceof Error ? error.message : 'The rule could not be saved.' };
  }
}

export async function deleteRuleAction(formData: FormData) { const session = await getSession(); if (!session) redirect('/login'); const id = String(formData.get('id')); await deleteRule(id); await recordAudit(session.id, 'rule.deleted', 'rule', id); revalidatePath('/dashboard/rules'); redirect('/dashboard/rules'); }
export async function duplicateRuleAction(formData: FormData) { const session = await getSession(); if (!session) redirect('/login'); const copy = await duplicateRule(String(formData.get('id')), session.id); await recordAudit(session.id, 'rule.duplicated', 'rule', copy.id, { name: copy.name }); revalidatePath('/dashboard/rules'); redirect(`/dashboard/rules/${copy.id}`); }
export async function restoreRuleAction(formData: FormData) { const session = await getSession(); if (!session) redirect('/login'); const payload = validate(JSON.parse(String(formData.get('snapshot')))); payload.status = 'draft'; const saved = await saveRule({ ...payload, id: payload.id || '' }, session.id); await recordAudit(session.id, 'rule.restored', 'rule', saved.id, { name: saved.name }); revalidatePath('/dashboard/rules'); redirect(`/dashboard/rules/${saved.id}?saved=restored`); }
