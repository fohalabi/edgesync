import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateGroup, evaluateRules } from '../lib/personalization/rules.ts';
import type { PersonalizationRequest, SegmentRule } from '../lib/types.ts';

const context: PersonalizationRequest = {
  country: 'NG', device: 'mobile', visitor: 'returning', language: 'en', localHour: 21,
  referrer: 'campaign', network: 'slow', pathname: '/', cookies: new Map(), headers: new Map(),
};

test('nested AND/OR groups evaluate against request context', () => {
  const trace = evaluateGroup({ combinator: 'and', items: [
    { field: 'device', operator: 'equals', value: 'mobile' },
    { combinator: 'or', items: [
      { field: 'localHour', operator: 'gte', value: 18 },
      { field: 'localHour', operator: 'lte', value: 5 },
    ] },
  ] }, context);
  assert.equal(trace.matched, true);
  assert.equal(trace.items.length, 2);
});

test('highest priority match wins and produces an evaluation trace', () => {
  const rules: SegmentRule[] = [
    { id: 'campaign', name: 'Campaign', priority: 20, enabled: true, expression: { combinator: 'and', items: [{ field: 'referrer', operator: 'equals', value: 'campaign' }] } },
    { id: 'mobile', name: 'Mobile', priority: 10, enabled: true, expression: { combinator: 'and', items: [{ field: 'device', operator: 'equals', value: 'mobile' }] } },
    { id: 'default', name: 'Default', priority: 0, enabled: true, fallback: true, expression: { combinator: 'and', items: [] } },
  ];
  const decision = evaluateRules(rules, context);
  assert.equal(decision.selectedRuleId, 'campaign');
  assert.equal(decision.evaluated.filter((rule) => rule.matched).length, 3);
});

test('same-priority matches are reported as conflicts', () => {
  const rules: SegmentRule[] = [
    { id: 'one', name: 'One', priority: 10, enabled: true, expression: { combinator: 'and', items: [{ field: 'device', operator: 'equals', value: 'mobile' }] } },
    { id: 'two', name: 'Two', priority: 10, enabled: true, expression: { combinator: 'and', items: [{ field: 'country', operator: 'equals', value: 'NG' }] } },
  ];
  const decision = evaluateRules(rules, context);
  assert.equal(decision.selectedRuleId, 'one');
  assert.deepEqual(decision.conflicts, ['two']);
});
