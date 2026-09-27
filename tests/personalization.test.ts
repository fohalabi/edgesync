import assert from 'node:assert/strict';
import test from 'node:test';
import { assignExperimentVariant, assignWeightedVariant, consistentHash, hashString } from '../lib/utils/hash.ts';
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

test('weighted experiment assignments are stable and respect excluded traffic', () => {
  const variants = [{ key: 'control', weight: 70 }, { key: 'treatment', weight: 30 }];
  assert.equal(assignWeightedVariant('visitor-42', 'pricing-test', variants, 100), assignWeightedVariant('visitor-42', 'pricing-test', variants, 100));
  assert.equal(assignWeightedVariant('visitor-42', 'pricing-test', variants, 0), undefined);
});

test('cookie utilities preserve anonymous visitor identity', () => {
  assert.equal(getCookie('user-id', 'theme=dark; user-id=visitor-42'), 'visitor-42');
  assert.match(generateUserId(), /^user_\d+_[a-z0-9]+$/);
});
