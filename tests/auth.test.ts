import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SESSION_SECRET = 'test-only-session-secret-with-at-least-32-characters';

test('signed sessions round-trip and reject tampering', async () => {
  const { createSessionToken, verifySessionToken } = await import('../lib/auth/token.ts');
  const user = { id: 'user-1', email: 'admin@example.com', name: 'Admin' };
  const token = await createSessionToken(user);

  assert.deepEqual(await verifySessionToken(token), user);
  assert.equal(await verifySessionToken(`${token}tampered`), null);
});
