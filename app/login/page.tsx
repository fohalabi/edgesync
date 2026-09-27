import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Activity, Check, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import LoginForm from './LoginForm';

export const metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getSession()) redirect('/dashboard');
  const { next } = await searchParams;
  const nextPath = next?.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-[#07110f] text-white lg:grid-cols-[1.05fr_.95fr]">
      <div className="edge-grid absolute inset-0 opacity-30" />
      <section className="relative hidden min-h-screen flex-col justify-between border-r border-white/8 p-10 lg:flex xl:p-16">
        <Link href="/" className="flex w-fit items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#76f7b2] text-[#07110f]"><Zap size={20} fill="currentColor" /></span><span className="text-lg font-semibold tracking-tight">EdgeSync</span></Link>
        <div className="max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/5 px-3 py-1.5 text-xs text-emerald-300"><Sparkles size={14} />Your edge workspace</div>
          <h1 className="text-6xl font-semibold leading-[.98] tracking-[-.06em] xl:text-7xl">Make every experience feel made for one.</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/50">Manage the rules, experiments and insights behind context-aware delivery.</p>
          <div className="mt-10 grid max-w-md gap-3 text-sm text-white/55"><Benefit icon={<Activity size={16} />} text="Inspect personalization decisions" /><Benefit icon={<ShieldCheck size={16} />} text="Secure, private administrator access" /><Benefit icon={<Check size={16} />} text="One focused workspace" /></div>
        </div>
        <p className="text-xs text-white/25">EdgeSync · Personalization at the speed of context</p>
      </section>

      <section className="relative grid min-h-screen place-items-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-16 flex w-fit items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#76f7b2] text-[#07110f]"><Zap size={20} fill="currentColor" /></span><span className="text-lg font-semibold">EdgeSync</span></Link>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#76f7b2]">Administrator access</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-.045em]">Welcome back.</h2>
          <p className="mt-3 text-sm leading-6 text-white/45">Sign in with the administrator account configured for this workspace.</p>
          <LoginForm nextPath={nextPath} />
          <p className="mt-6 text-center text-xs text-white/30">Protected by an encrypted, HTTP-only session.</p>
        </div>
      </section>
    </main>
  );
}

function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) { return <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#76f7b2]/10 text-[#76f7b2]">{icon}</span>{text}</div>; }
