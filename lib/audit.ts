import 'server-only';
import { db } from '@/lib/db';

export type AuditEntry = {
  id: number;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  userName: string;
  createdAt: string;
};

export async function recordAudit(userId: string, action: string, entityType: string, entityId?: string | null, metadata: Record<string, unknown> = {}) {
  await db.query(
    'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata) VALUES ($1,$2,$3,$4,$5)',
    [userId, action.slice(0, 80), entityType.slice(0, 40), entityId || null, JSON.stringify(metadata)]
  );
}

export async function listAuditEntries(limit = 50): Promise<AuditEntry[]> {
  const safeLimit = Math.min(100, Math.max(1, limit));
  const result = await db.query(`SELECT a.id,a.action,a.entity_type,a.entity_id,a.metadata,a.created_at,COALESCE(u.name,'Former administrator') user_name
    FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT $1`, [safeLimit]);
  return result.rows.map((row) => ({
    id: Number(row.id), action: String(row.action), entityType: String(row.entity_type),
    entityId: row.entity_id ? String(row.entity_id) : null, metadata: row.metadata || {},
    userName: String(row.user_name), createdAt: new Date(row.created_at).toISOString(),
  }));
}

