'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Braces, Check, CheckCircle2, ChevronRight, Github, Globe2, Moon, MousePointer2, Sparkles, Sun, XCircle, Zap } from 'lucide-react';
import type { ConditionTrace, GroupTrace } from '@/lib/types';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useTheme } from '@/hooks/useTheme';
import ContextSimulator from './ContextSimulator';

export default function PersonalizedHero() {
  const { data, loading, updating, error, simulationActive } = usePersonalization();
  const { darkMode, toggleTheme } = useTheme();

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#07110f] text-[#e7fff5]"><div className="flex items-center gap-3 text-sm text-emerald-100/70"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#76f7b2] shadow-[0_0_24px_#76f7b2]" />Resolving your edge context…</div></main>;
  if (error || !data) return <main className="grid min-h-screen place-items-center bg-[#07110f] px-6 text-[#e7fff5]"><div className="max-w-md rounded-3xl border border-red-300/20 bg-white/5 p-8 text-center"><p className="mb-2 text-lg font-semibold">The edge did not respond.</p><p className="text-sm text-white/55">Refresh the page to retry the personalization request.</p></div></main>;

  const { variant, segment } = data;
  const unknownCountry = !segment.country || segment.country === 'unknown';
  const contextLabel = `${unknownCountry ? 'Global' : segment.country} · ${segment.device}`;
  const selectedRule = data.decision.evaluated.find((rule) => rule.id === data.decision.selectedRuleId);
  const selectedConditions = selectedRule ? flattenConditions(selectedRule.trace) : [];

  return (
    <main className={darkMode ? 'min-h-screen bg-[#07110f] text-[#effff7] [--surface:#0b1814]' : 'min-h-screen bg-[#f4f8f4] text-[#10251e] [--surface:#fff]'}>
      <div className="relative isolate overflow-hidden">
        <div className="edge-grid absolute inset-0 -z-20 opacity-40" />
        <div className="absolute left-1/2 top-[-28rem] -z-10 h-[50rem] w-[70rem] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-[140px]" />
        <header className="mx-auto flex w-full max-w-[96rem] items-center justify-between px-5 py-6 sm:px-8 xl:px-12">
          <Link href="/" className="flex items-center gap-3" aria-label="EdgeSync home"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#76f7b2] text-[#07110f] shadow-[0_0_30px_rgba(118,247,178,.2)]"><Zap size={20} fill="currentColor" /></span><span className="text-lg font-semibold tracking-[-0.03em]">EdgeSync</span></Link>
          <nav className="flex items-center gap-1 rounded-full border border-current/10 bg-white/5 p-1.5 backdrop-blur-xl">
            <a className="hidden rounded-full px-4 py-2 text-sm opacity-60 transition hover:opacity-100 sm:block" href="#how-it-works">How it works</a>
            <a href="https://github.com/fohalabi/edgesync" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10" aria-label="View EdgeSync on GitHub"><Github size={17} /></a>
            <button onClick={toggleTheme} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10" aria-label="Toggle theme">{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button>
          </nav>
        </header>

        <section className="mx-auto grid w-full max-w-[96rem] gap-14 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:pb-32 lg:pt-28 xl:gap-20 xl:px-12">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/5 px-3 py-1.5 text-xs font-medium text-emerald-300"><span className="relative flex h-2 w-2"><span className={`${updating ? 'animate-spin border border-emerald-300 border-t-transparent' : 'bg-emerald-300'} relative h-2 w-2 rounded-full`} /></span>{updating ? 'Re-evaluating context' : simulationActive ? 'Simulated context active' : 'Context resolved at the edge'}</div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[.98] tracking-[-0.065em] sm:text-7xl lg:text-[5.5rem]">{variant.content.headline}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 opacity-60 sm:text-xl">{variant.content.subheadline}. One request in, one intentional experience out.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#76f7b2] px-6 py-3.5 text-sm font-semibold text-[#07110f] shadow-[0_12px_40px_rgba(118,247,178,.18)] transition hover:-translate-y-0.5 hover:bg-[#91ffc5]">{variant.content.cta}<ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-full border border-current/15 px-6 py-3.5 text-sm font-semibold transition hover:bg-white/5">See the decision <ChevronRight size={16} /></a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium uppercase tracking-[.16em] opacity-45"><span className="flex items-center gap-2"><Check size={14} /> No page reload</span><span className="flex items-center gap-2"><Check size={14} /> Stable variants</span><span className="flex items-center gap-2"><Check size={14} /> Privacy-minded</span></div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute h-72 w-72 rounded-full bg-[#76f7b2]/10 blur-3xl" />
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1c18]/90 p-3 shadow-[0_30px_100px_rgba(0,0,0,.4)] backdrop-blur-2xl">
              <div className="flex items-center justify-between px-4 py-3 text-xs text-white/40"><span>Decision trace</span><span className="rounded-full bg-[#76f7b2]/10 px-2.5 py-1 text-[#76f7b2]">Resolved</span></div>
              <div className="rounded-[1.4rem] border border-white/8 bg-black/20 p-5 text-white">
                <div className="mb-6 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5"><Globe2 size={19} className="text-[#76f7b2]" /></div><div><p className="text-xs text-white/40">Visitor context</p><p className="font-medium">{contextLabel}</p></div></div>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs"><TraceRow icon={<Globe2 size={14} />} label="country" value={unknownCountry ? 'unknown' : segment.country} /><TraceRow icon={<MousePointer2 size={14} />} label="device" value={segment.device} /><TraceRow icon={<Sparkles size={14} />} label="visitor" value={segment.isNewUser ? 'new' : 'returning'} /><TraceRow icon={<Braces size={14} />} label="language" value={segment.language} /><TraceRow icon={<Braces size={14} />} label="time" value={`${String(segment.localHour).padStart(2, '0')}:00`} /><TraceRow icon={<Braces size={14} />} label="network" value={segment.network} /></div>
                <div className="my-5 h-px bg-white/10" />
                <div className="flex items-center justify-between"><div><p className="text-xs text-white/40">Matched segment</p><p className="mt-1 font-mono text-sm text-[#76f7b2]">{segment.id}</p></div><Zap size={22} className="text-[#76f7b2]" /></div>
                <details className="mt-4 rounded-xl border border-white/8 bg-white/[.025] p-3">
                  <summary className="cursor-pointer text-xs font-medium text-white/65">Why this rule matched</summary>
                  <div className="mt-3 space-y-2">
                    {selectedConditions.length === 0 && <p className="text-xs text-white/35">Fallback rule selected because no higher-priority rule matched.</p>}
                    {selectedConditions.map((condition, index) => <div key={`${condition.field}-${index}`} className="flex items-start gap-2 text-[11px]">{condition.matched ? <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#76f7b2]" /> : <XCircle size={13} className="mt-0.5 shrink-0 text-red-300" />}<span className="text-white/45"><strong className="font-medium text-white/70">{condition.field}</strong> {humanOperator(condition.operator)} {formatValue(condition.value)} <span className="text-white/25">(actual: {String(condition.actual)})</span></span></div>)}
                    {data.decision.conflicts.length > 0 && <p className="flex gap-2 rounded-lg bg-amber-300/10 p-2 text-[11px] text-amber-200"><AlertTriangle size={13} />Same-priority matches: {data.decision.conflicts.join(', ')}</p>}
                  </div>
                </details>
                <details className="mt-2 px-1"><summary className="cursor-pointer text-[11px] text-white/35">Evaluated {data.decision.evaluated.length} rules</summary><div className="mt-2 space-y-1">{data.decision.evaluated.map((rule) => <div key={rule.id} className="flex justify-between text-[10px] text-white/35"><span>{rule.name}</span><span className={rule.matched ? 'text-[#76f7b2]' : ''}>{rule.matched ? 'matched' : 'skipped'} · P{rule.priority}</span></div>)}</div></details>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="how-it-works" className={darkMode ? 'border-t border-white/8 bg-white/[.025]' : 'border-t border-black/8 bg-white'}>
        <div className="mx-auto w-full max-w-[96rem] px-5 py-24 sm:px-8 xl:px-12"><div className="mb-14 max-w-2xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">One request. Three decisions.</p><h2 className="text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Personalization without the detour.</h2></div><div className="grid gap-px overflow-hidden rounded-3xl border border-current/10 bg-current/10 md:grid-cols-3"><Feature number="01" title="Read the context" copy="Country, device and returning-visitor signals are interpreted before the experience is selected." /><Feature number="02" title="Match intentionally" copy="Prioritized segments choose a content variant with deterministic experiment assignment." /><Feature number="03" title="Deliver consistently" copy="A durable anonymous identity keeps the experience stable from one request to the next." /></div></div>
      </section>
      <ContextSimulator />
    </main>
  );
}

function TraceRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="min-w-0 rounded-xl bg-white/[.035] px-3 py-2.5"><span className="mb-1 flex items-center gap-1.5 text-[10px] text-white/35"><span className="text-[#76f7b2]">{icon}</span>{label}</span><span className="block truncate text-white/80">{value}</span></div>; }
function Feature({ number, title, copy }: { number: string; title: string; copy: string }) { return <article className="bg-[var(--surface)] p-7 sm:p-9"><span className="font-mono text-xs text-emerald-400">{number}</span><h3 className="mt-8 text-xl font-semibold tracking-[-.02em]">{title}</h3><p className="mt-3 text-sm leading-6 opacity-55">{copy}</p></article>; }
function flattenConditions(group: GroupTrace): ConditionTrace[] { return group.items.flatMap((item) => 'items' in item ? flattenConditions(item) : [item]); }
function humanOperator(operator: ConditionTrace['operator']) { return ({ equals: 'equals', not_equals: 'does not equal', in: 'is one of', not_in: 'is not one of', contains: 'contains', gte: 'is at least', lte: 'is at most' })[operator]; }
function formatValue(value: ConditionTrace['value']) { return Array.isArray(value) ? value.join(', ') : String(value); }
