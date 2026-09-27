import Link from 'next/link';
import RuleBuilder from '../RuleBuilder';

export default function NewRulePage() { return <main className="min-h-screen bg-[#07110f] px-5 py-8 text-white sm:px-8"><div className="mx-auto max-w-[96rem]"><Link href="/dashboard/rules" className="text-sm text-white/45 hover:text-white">← Back to rules</Link><div className="mb-8 mt-10"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#76f7b2]">New rule</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">Design an experience.</h1></div><RuleBuilder initial={null} /></div></main>; }
