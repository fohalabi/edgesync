import Link from 'next/link';
import ThemeSurface from '@/app/components/ThemeSurface';
import { listRules } from '@/lib/rules/store';
import ExperimentForm from '../ExperimentForm';
export const dynamic='force-dynamic';
export default async function NewExperimentPage(){const rules=await listRules();return <ThemeSurface><main className="min-h-screen bg-[#07110f] px-5 py-8 text-white sm:px-8"><div className="mx-auto max-w-[96rem]"><Link href="/dashboard/experiments" className="text-sm text-white/45">← Back to experiments</Link><div className="mb-8 mt-10"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#76f7b2]">New experiment</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">Test an intentional change.</h1></div><ExperimentForm initial={null} rules={rules}/></div></main></ThemeSurface>}
