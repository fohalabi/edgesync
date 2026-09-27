'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const CONSENT_KEY = 'edgesync-analytics-consent';
export type AnalyticsConsent = 'granted' | 'denied';

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'granted' || value === 'denied' ? value : null;
}

export default function ConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setConsent(readAnalyticsConsent());
    const show = () => setOpen(true);
    window.addEventListener('edgesync:privacy', show);
    return () => window.removeEventListener('edgesync:privacy', show);
  }, []);

  function choose(value: AnalyticsConsent) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('edgesync:consent', { detail: value }));
  }

  if (consent === undefined || (consent !== null && !open)) return null;

  return <aside aria-label="Analytics privacy preferences" className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#0d1c18] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,.45)] sm:p-6">
    {open && <button onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white" aria-label="Close privacy preferences"><X size={16} /></button>}
    <div className="flex items-start gap-3 pr-8"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#76f7b2]/10 text-[#76f7b2]"><ShieldCheck size={18} /></span><div><h2 className="font-semibold">Privacy, by choice.</h2><p className="mt-1 text-sm leading-6 text-white/55">EdgeSync uses an anonymous, hashed visitor ID to measure impressions and conversions. No advertising cookies or personal profile data are collected.</p></div></div>
    <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button onClick={() => choose('denied')} className="rounded-full border border-white/15 px-5 py-2.5 text-sm">Use essential only</button><button onClick={() => choose('granted')} className="rounded-full bg-[#76f7b2] px-5 py-2.5 text-sm font-semibold text-[#07110f]">Allow anonymous analytics</button></div>
  </aside>;
}

export function PrivacyButton() {
  return <button onClick={() => window.dispatchEvent(new Event('edgesync:privacy'))} className="text-xs opacity-50 transition hover:opacity-100">Privacy preferences</button>;
}

