import pg from 'pg';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
const days = Math.max(1, Number(process.env.ANALYTICS_RETENTION_DAYS || 30));
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try { await client.connect(); const result = await client.query(`DELETE FROM events WHERE created_at < NOW() - ($1 * INTERVAL '1 day')`, [days]); console.log(`Pruned ${result.rowCount} events older than ${days} days`); } finally { await client.end(); }
