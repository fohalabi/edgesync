import assert from 'node:assert/strict';
import test from 'node:test';
import { assignExperimentVariant, consistentHash, hashString } from '../lib/utils/hash.ts';
import { generateUserId, getCookie } from '../lib/utils/cookies.ts';

test('hashing is deterministic and stays inside its bucket range', () => {
  assert.equal(hashString('same-input'), hashString('same-input'));
  const bucket = consistentHash('visitor-42', 'hero-test', 100);
  assert.ok(bucket >= 0 && bucket < 100);
});

test('experiment assignment is stable for the same visitor', () => {
  const variants = ['control', 'variant-a', 'variant-b'];
  const first = assignExperimentVariant('visitor-42', 'hero-test', variants);
  const second = assignExperimentVariant('visitor-42', 'hero-test', variants);
  assert.equal(first, second);
  assert.ok(variants.includes(first));
});

test('zero experiment traffic always resolves to control', () => {
  assert.equal(assignExperimentVariant('visitor-42', 'hero-test', ['a', 'b'], 0), 'control');
});

test('cookie utilities preserve anonymous visitor identity', () => {
  assert.equal(getCookie('user-id', 'theme=dark; user-id=visitor-42'), 'visitor-42');
  assert.match(generateUserId(), /^user_\d+_[a-z0-9]+$/);
});
