import Link from 'next/link';
import RuleBuilder from '../RuleBuilder';
import WorkspaceShell from '@/app/components/WorkspaceShell';

export default function NewRulePage() { return <WorkspaceShell active="rules" title="New rule" description="Create a new contextual experience"><Link href="/dashboard/rules" className="text-sm text-white/45 hover:text-white">← Back to rules</Link><div className="mb-8 mt-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#76f7b2]">New rule</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">Design an experience.</h1></div><RuleBuilder initial={null} /></WorkspaceShell>; }
