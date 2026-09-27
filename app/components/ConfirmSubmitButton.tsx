'use client';

export default function ConfirmSubmitButton({ message, className, children, ariaLabel }: { message: string; className?: string; children: React.ReactNode; ariaLabel?: string }) {
  return <button type="submit" className={className} aria-label={ariaLabel} onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>{children}</button>;
}

