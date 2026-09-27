import WorkspaceShell from '@/app/components/WorkspaceShell';
import { listAuditEntries } from '@/lib/audit';

export const metadata = { title: 'Activity' };
export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
  const entries = await listAuditEntries();
  return <WorkspaceShell active="activity" title="Activity" description="Review important administrator changes">
    <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#76f7b2]">Auditability</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">Workspace activity</h1><p className="mt-2 text-sm text-white/45">The latest administrator changes across rules and experiments.</p></div>
    <div className="overflow-hidden rounded-2xl border border-white/10">{entries.length === 0 ? <p className="p-10 text-center text-sm text-white/45">No administrator changes recorded yet.</p> : entries.map((entry) => <article key={entry.id} className="grid gap-2 border-b border-white/8 p-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-medium">{humanize(entry.action)} <span className="text-white/40">· {entry.entityType}</span></p><p className="mt-1 text-xs text-white/35">{entry.userName}{entry.entityId ? ` · ${entry.entityId}` : ''}</p></div><time dateTime={entry.createdAt} className="text-xs text-white/35">{new Date(entry.createdAt).toLocaleString()}</time></article>)}</div>
  </WorkspaceShell>;
}

function humanize(value: string) { return value.replaceAll('.', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); }
