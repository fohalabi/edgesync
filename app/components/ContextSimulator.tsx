'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Eye, RotateCcw, SlidersHorizontal, X } from 'lucide-react';

type SimulatorState = { country: string; device: string; visitor: string; language: string; hour: string; referrer: string; network: string };
const defaults: SimulatorState = { country: 'auto', device: 'auto', visitor: 'auto', language: 'auto', hour: 'auto', referrer: 'auto', network: 'auto' };
const countries = [['auto', 'Detected location'], ['NG', 'Nigeria'], ['US', 'United States'], ['GB', 'United Kingdom'], ['CA', 'Canada'], ['DE', 'Germany'], ['FR', 'France'], ['IN', 'India'], ['BR', 'Brazil'], ['SG', 'Singapore'], ['AU', 'Australia']] as const;
const presets: Array<{ name: string; description: string; values: Partial<SimulatorState> }> = [
  { name: 'Lagos mobile', description: 'Returning visitor on mobile', values: { country: 'NG', device: 'mobile', visitor: 'returning' } },
  { name: 'French campaign', description: 'French paid-campaign visitor', values: { country: 'FR', language: 'fr', referrer: 'campaign' } },
  { name: 'Slow connection', description: 'Mobile visitor on a 2G-like network', values: { device: 'mobile', network: 'slow' } },
  { name: 'Evening session', description: 'Local context at 9 PM', values: { hour: '21' } },
];

export default function ContextSimulator() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [embedded, setEmbedded] = useState(false);
  const [values, setValues] = useState<SimulatorState>(defaults);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmbedded(params.has('embed'));
    setValues(Object.fromEntries(Object.keys(defaults).map((key) => [key, params.get(key) || 'auto'])) as SimulatorState);
  }, []);

  const activeCount = Object.values(values).filter((value) => value !== 'auto').length;
  const previewDevice = values.device === 'tablet' ? 'tablet' : 'mobile';

  function update(key: keyof SimulatorState, value: string) { setValues((current) => ({ ...current, [key]: value })); }
  function apply(next = values) {
    const url = buildUrl(next);
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    setValues(next);
    window.dispatchEvent(new Event('edgesync:simulation'));
    setOpen(false);
  }
  function reset() { apply(defaults); }
  async function copyScenario() { await navigator.clipboard.writeText(buildUrl(values).toString()); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
  function applyPreset(preset: Partial<SimulatorState>) { apply({ ...defaults, ...preset }); }
  function openPreview() { setPreviewUrl(buildUrl(values, true).toString()); setPreview(true); }

  if (embedded) return null;

  return <>
    {preview && <div className="fixed inset-0 z-[70] grid place-items-center bg-[#030907]/85 p-4 backdrop-blur-md">
      <div className="flex max-h-[95vh] flex-col rounded-[2rem] border border-white/10 bg-[#0d1c18] p-3 shadow-2xl">
        <div className="flex items-center justify-between px-3 py-2 text-white"><div><p className="text-sm font-semibold">{previewDevice === 'tablet' ? 'Tablet' : 'Mobile'} preview</p><p className="text-xs text-white/40">Live scenario viewport</p></div><button onClick={() => setPreview(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/5" aria-label="Close preview"><X size={17} /></button></div>
        <iframe title="EdgeSync scenario preview" src={previewUrl} className={`rounded-[1.35rem] border border-white/10 bg-white ${previewDevice === 'tablet' ? 'h-[720px] w-[min(768px,85vw)]' : 'h-[720px] w-[min(390px,85vw)]'}`} />
      </div>
    </div>}
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {open && <div className="mb-3 max-h-[78vh] w-[calc(100vw-2.5rem)] max-w-md overflow-y-auto rounded-[1.6rem] border border-white/10 bg-[#0d1c18]/95 p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl">
        <div className="flex items-start justify-between px-1 pb-4"><div><p className="text-sm font-semibold">Context simulator</p><p className="mt-1 text-xs text-white/40">Override the detected request context.</p></div><button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-white/40 hover:bg-white/5 hover:text-white" aria-label="Close simulator"><X size={16} /></button></div>

        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[.16em] text-white/30">Quick scenarios</p>
        <div className="mb-4 grid grid-cols-2 gap-2">{presets.map((preset) => <button key={preset.name} onClick={() => applyPreset(preset.values)} className="rounded-xl border border-white/8 bg-white/[.035] p-3 text-left transition hover:border-[#76f7b2]/30 hover:bg-white/[.06]"><span className="block text-xs font-medium">{preset.name}</span><span className="mt-1 block text-[10px] leading-4 text-white/35">{preset.description}</span></button>)}</div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Country" value={values.country} onChange={(value) => update('country', value)} options={countries} />
          <Field label="Device" value={values.device} onChange={(value) => update('device', value)} options={[["auto", "Detected device"], ["mobile", "Mobile"], ["tablet", "Tablet"], ["desktop", "Desktop"]]} />
          <Field label="Visitor" value={values.visitor} onChange={(value) => update('visitor', value)} options={[["auto", "Detected status"], ["new", "New visitor"], ["returning", "Returning visitor"]]} />
          <Field label="Language" value={values.language} onChange={(value) => update('language', value)} options={[["auto", "Browser language"], ["en", "English"], ["fr", "French"], ["es", "Spanish"], ["pt", "Portuguese"]]} />
          <Field label="Local time" value={values.hour} onChange={(value) => update('hour', value)} options={[["auto", "Current local time"], ...Array.from({ length: 24 }, (_, hour) => [String(hour), `${String(hour).padStart(2, '0')}:00`] as const)]} />
          <Field label="Referrer" value={values.referrer} onChange={(value) => update('referrer', value)} options={[["auto", "Detected referrer"], ["direct", "Direct"], ["search", "Search"], ["social", "Social"], ["campaign", "Campaign"]]} />
          <Field label="Network" value={values.network} onChange={(value) => update('network', value)} options={[["auto", "Detected network"], ["fast", "Fast / 4G"], ["standard", "Standard / 3G"], ["slow", "Slow / 2G"]]} />
        </div>

        <button onClick={() => apply()} className="mt-4 w-full rounded-full bg-[#76f7b2] px-4 py-3 text-sm font-semibold text-[#07110f] hover:bg-[#91ffc5]">Apply without reloading</button>
        <div className="mt-2 grid grid-cols-3 gap-2"><button onClick={openPreview} className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 px-2 py-2.5 text-[11px] text-white/60 hover:bg-white/5 hover:text-white"><Eye size={13} />Preview</button><button onClick={copyScenario} className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 px-2 py-2.5 text-[11px] text-white/60 hover:bg-white/5 hover:text-white">{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Copied' : 'Copy link'}</button><button onClick={reset} disabled={!activeCount} className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 px-2 py-2.5 text-[11px] text-white/60 hover:bg-white/5 hover:text-white disabled:opacity-30"><RotateCcw size={13} />Reset</button></div>
      </div>}
      <button onClick={() => setOpen((value) => !value)} className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1c18] px-4 py-3 text-sm font-medium text-white shadow-[0_14px_45px_rgba(0,0,0,.3)] transition hover:-translate-y-0.5" aria-expanded={open}><SlidersHorizontal size={17} className="text-[#76f7b2]" />Simulate context{activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#76f7b2] px-1 text-[10px] font-bold text-[#07110f]">{activeCount}</span>}</button>
    </div>
  </>;
}

function buildUrl(values: SimulatorState, embedded = false) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(values)) { if (value === 'auto') url.searchParams.delete(key); else url.searchParams.set(key, value); }
  if (embedded) url.searchParams.set('embed', '1'); else url.searchParams.delete('embed');
  url.hash = '';
  return url;
}

function Field({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return <label className="block"><span className="mb-1.5 block px-1 text-[10px] font-medium uppercase tracking-[.14em] text-white/35">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-white/[.045] px-3 py-2.5 text-xs text-white outline-none focus:border-[#76f7b2]/45">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue} className="bg-[#0d1c18]">{optionLabel}</option>)}</select></label>;
}
