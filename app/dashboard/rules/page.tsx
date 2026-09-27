import Link from 'next/link';
import { Copy, Plus, Settings2, Trash2 } from 'lucide-react';
import { listRules } from '@/lib/rules/store';
import { deleteRuleAction, duplicateRuleAction } from './actions';
import ThemeSurface from '@/app/components/ThemeSurface';

export const metadata = { title: 'Rules' };
export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const rules = await listRules();
  return <ThemeSurface><main className="min-h-screen bg-[#07110f] px-5 py-8 text-white sm:px-8"><div className="mx-auto max-w-[96rem]">
    <RulesNav />
    <div className="mb-8 mt-12 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#76f7b2]">Personalization</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">Rules</h1><p className="mt-2 text-sm text-white/45">Draft, preview and publish the decisions behind every experience.</p></div><Link href="/dashboard/rules/new" className="flex items-center gap-2 rounded-full bg-[#76f7b2] px-5 py-3 text-sm font-semibold text-[#07110f]"><Plus size={16} />New rule</Link></div>
    <div className="overflow-hidden rounded-2xl border border-white/10">
      {rules.length === 0 ? <div className="p-12 text-center"><Settings2 className="mx-auto text-white/20" /><p className="mt-4 font-medium">No database rules yet</p><p className="mt-2 text-sm text-white/40">The checked-in configuration remains active until you publish your first rule.</p></div> : rules.map((rule) => <div key={rule.id} className="grid items-center gap-4 border-b border-white/8 p-4 last:border-0 sm:grid-cols-[1fr_auto_auto]"><Link href={`/dashboard/rules/${rule.id}`} className="group"><div className="flex items-center gap-3"><span className={`h-2 w-2 rounded-full ${rule.status === 'published' && rule.enabled ? 'bg-[#76f7b2]' : 'bg-amber-400'}`} /><div><p className="font-medium group-hover:text-[#76f7b2]">{rule.name}</p><p className="mt-1 font-mono text-xs text-white/35">{rule.slug} · priority {rule.priority}</p></div></div></Link><span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-white/50">{rule.status}</span><div className="flex gap-1"><form action={duplicateRuleAction}><input type="hidden" name="id" value={rule.id} /><button className="grid h-9 w-9 place-items-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white" aria-label="Duplicate rule"><Copy size={15} /></button></form><form action={deleteRuleAction}><input type="hidden" name="id" value={rule.id} /><button className="grid h-9 w-9 place-items-center rounded-lg text-white/40 hover:bg-red-400/10 hover:text-red-300" aria-label="Delete rule"><Trash2 size={15} /></button></form></div></div>)}
    </div>
  </div></main></ThemeSurface>;
}

export function RulesNav() { return <nav className="flex items-center justify-between"><Link href="/" className="font-semibold">⚡ EdgeSync</Link><div className="flex gap-1 rounded-full border border-white/10 p-1 text-sm"><Link href="/dashboard" className="rounded-full px-4 py-2 text-white/50 hover:text-white">Analytics</Link><Link href="/dashboard/rules" className="rounded-full bg-white/10 px-4 py-2">Rules</Link><Link href="/dashboard/experiments" className="rounded-full px-4 py-2 text-white/50 hover:text-white">Experiments</Link></div></nav>; }
