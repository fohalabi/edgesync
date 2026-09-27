'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { login, type LoginState } from './actions';

const initialState: LoginState = { error: null };

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} noValidate className="mt-8 space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-white/70">Email address</span>
        <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] px-4 transition focus-within:border-[#76f7b2]/50 focus-within:bg-white/[.055]">
          <Mail size={17} className="text-white/35" />
          <input name="email" type="email" autoComplete="email" required autoFocus placeholder="you@example.com" className="h-13 w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-white/25" />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-white/70">Password</span>
        <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] px-4 transition focus-within:border-[#76f7b2]/50 focus-within:bg-white/[.055]">
          <LockKeyhole size={17} className="text-white/35" />
          <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Your password" className="h-13 w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-white/25" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-white/35 transition hover:text-white/70" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </span>
      </label>
      {state.error && <p role="alert" className="rounded-xl border border-red-300/15 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#76f7b2] px-5 py-3.5 text-sm font-semibold text-[#07110f] transition hover:-translate-y-0.5 hover:bg-[#91ffc5] disabled:cursor-wait disabled:opacity-70">{pending ? <><LoaderCircle size={17} className="animate-spin" /> Signing in…</> : <>Continue to dashboard <ArrowRight size={17} className="transition group-hover:translate-x-1" /></>}</button>;
}
