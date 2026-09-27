import Link from 'next/link';
import WorkspaceShell from '@/app/components/WorkspaceShell';
import { listRules } from '@/lib/rules/store';
import ExperimentForm from '../ExperimentForm';
export const dynamic='force-dynamic';
export default async function NewExperimentPage(){const rules=await listRules();return <WorkspaceShell active="experiments" title="New experiment" description="Configure audience, traffic, and variants"><Link href="/dashboard/experiments" className="text-sm text-white/45">← Back to experiments</Link><div className="mb-8 mt-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#76f7b2]">New experiment</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">Test an intentional change.</h1></div><ExperimentForm initial={null} rules={rules}/></WorkspaceShell>}
