'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, RotateCcw, SlidersHorizontal, X } from 'lucide-react';

const countries = [['auto', 'Detected location'], ['NG', 'Nigeria'], ['US', 'United States'], ['GB', 'United Kingdom'], ['CA', 'Canada'], ['DE', 'Germany'], ['FR', 'France'], ['IN', 'India'], ['BR', 'Brazil'], ['SG', 'Singapore'], ['AU', 'Australia']] as const;
type SimulatorState = { country: string; device: string; visitor: string };
const defaults: SimulatorState = { country: 'auto', device: 'auto', visitor: 'auto' };

export default function ContextSimulator() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<SimulatorState>(defaults);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValues({ country: params.get('country') || 'auto', device: params.get('device') || 'auto', visitor: params.get('visitor') || 'auto' });
  }, []);

  const activeCount = Object.values(values).filter((value) => value !== 'auto').length;
  function buildUrl(next: SimulatorState) { const url = new URL(window.location.href); for (const [key, value] of Object.entries(next)) { if (value === 'auto') url.searchParams.delete(key); else url.searchParams.set(key, value); } url.hash = ''; return url; }
  function apply() { window.location.assign(buildUrl(values).toString()); }
  function reset() { window.location.assign(buildUrl(defaults).toString()); }
  async function copyScenario() { await navigator.clipboard.writeText(buildUrl(values).toString()); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {open && <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm rounded-[1.6rem] border border-white/10 bg-[#0d1c18]/95 p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl">
        <div className="flex items-start justify-between px-1 pb-4"><div><p className="text-sm font-semibold">Context simulator</p><p className="mt-1 text-xs text-white/40">Override what the edge detects.</p></div><button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-white/40 transition hover:bg-white/5 hover:text-white" aria-label="Close simulator"><X size={16} /></button></div>
        <div className="space-y-3">
          <Field label="Country" value={values.country} onChange={(country) => setValues({ ...values, country })} options={countries} />
          <Field label="Device" value={values.device} onChange={(device) => setValues({ ...values, device })} options={[["auto", "Detected device"], ["mobile", "Mobile"], ["tablet", "Tablet"], ["desktop", "Desktop"]]} />
          <Field label="Visitor" value={values.visitor} onChange={(visitor) => setValues({ ...values, visitor })} options={[["auto", "Detected status"], ["new", "New visitor"], ["returning", "Returning visitor"]]} />
        </div>
        <button onClick={apply} className="mt-4 w-full rounded-full bg-[#76f7b2] px-4 py-3 text-sm font-semibold text-[#07110f] transition hover:bg-[#91ffc5]">Apply scenario</button>
        <div className="mt-2 grid grid-cols-2 gap-2"><button onClick={copyScenario} className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-3 py-2.5 text-xs text-white/60 transition hover:bg-white/5 hover:text-white">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy link'}</button><button onClick={reset} disabled={!activeCount} className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-3 py-2.5 text-xs text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-30"><RotateCcw size={14} />Reset</button></div>
      </div>}
      <button onClick={() => setOpen((value) => !value)} className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1c18] px-4 py-3 text-sm font-medium text-white shadow-[0_14px_45px_rgba(0,0,0,.3)] transition hover:-translate-y-0.5" aria-expanded={open}><SlidersHorizontal size={17} className="text-[#76f7b2]" />Simulate context{activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#76f7b2] px-1 text-[10px] font-bold text-[#07110f]">{activeCount}</span>}</button>
    </div>
  );
}

function Field({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return <label className="block"><span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-[.14em] text-white/35">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-white/[.045] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#76f7b2]/45">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue} className="bg-[#0d1c18]">{optionLabel}</option>)}</select></label>;
}
