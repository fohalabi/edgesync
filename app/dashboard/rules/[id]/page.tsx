import Link from 'next/link';
import { notFound } from 'next/navigation';
import WorkspaceShell from '@/app/components/WorkspaceShell';
import { getRule, getRuleVersions } from '@/lib/rules/store';
import RuleBuilder from '../RuleBuilder';
import { restoreRuleAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditRulePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const rule = await getRule(id);
  if (!rule) notFound();
  const versions = await getRuleVersions(id);
  const { saved } = await searchParams;
  return <WorkspaceShell active="rules" title="Edit rule" description="Refine conditions, content, and publishing state">
    <Link href="/dashboard/rules" className="text-sm text-white/45 hover:text-white">← Back to rules</Link>
    <div className="mb-8 mt-10 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#76f7b2]">Edit rule</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">{rule.name}</h1></div>{saved && <span className="rounded-full bg-[#76f7b2]/10 px-3 py-1.5 text-xs text-[#76f7b2]">{saved === 'publish' ? 'Published' : saved === 'restored' ? 'Version restored as draft' : 'Draft saved'}</span>}</div>
    <RuleBuilder initial={rule} />
    <section className="mt-8 rounded-2xl border border-white/10 p-6"><h2 className="font-semibold">Version history</h2><div className="mt-4 divide-y divide-white/8">{versions.map((version) => <div key={version.id} className="flex items-center justify-between py-3 text-sm"><div><p>Version {version.version}</p><p className="mt-1 text-xs text-white/35">{new Date(version.created_at).toLocaleString()}</p></div><form action={restoreRuleAction}><input type="hidden" name="snapshot" value={JSON.stringify(version.snapshot)} /><button className="rounded-full border border-white/10 px-3 py-1.5 text-xs">Restore as draft</button></form></div>)}</div></section>
  </WorkspaceShell>;
}
