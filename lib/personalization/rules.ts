import type { ConditionTrace, DecisionTrace, GroupTrace, PersonalizationRequest, RuleCondition, RuleGroup, SegmentRule } from '../types';

function isGroup(item: RuleCondition | RuleGroup): item is RuleGroup {
  return 'items' in item;
}

function actualValue(context: PersonalizationRequest, field: RuleCondition['field']): string | number {
  if (field === 'country') return context.country || 'unknown';
  return context[field];
}

export function evaluateCondition(condition: RuleCondition, context: PersonalizationRequest): ConditionTrace {
  const actual = actualValue(context, condition.field);
  const expected = condition.value;
  let matched = false;

  switch (condition.operator) {
    case 'equals': matched = actual === expected; break;
    case 'not_equals': matched = actual !== expected; break;
    case 'in': matched = Array.isArray(expected) && expected.includes(String(actual)); break;
    case 'not_in': matched = Array.isArray(expected) && !expected.includes(String(actual)); break;
    case 'contains': matched = String(actual).toLowerCase().includes(String(expected).toLowerCase()); break;
    case 'gte': matched = Number(actual) >= Number(expected); break;
    case 'lte': matched = Number(actual) <= Number(expected); break;
  }

  return { ...condition, actual, matched };
}

export function evaluateGroup(group: RuleGroup, context: PersonalizationRequest): GroupTrace {
  const items = group.items.map((item) => isGroup(item) ? evaluateGroup(item, context) : evaluateCondition(item, context));
  const matched = group.combinator === 'and' ? items.every((item) => item.matched) : items.some((item) => item.matched);
  return { combinator: group.combinator, matched, items };
}

export function evaluateRules(rules: SegmentRule[], context: PersonalizationRequest): DecisionTrace {
  const evaluated = rules
    .filter((rule) => rule.enabled)
    .sort((a, b) => b.priority - a.priority)
    .map((rule) => {
      const trace = evaluateGroup(rule.expression, context);
      return { id: rule.id, name: rule.name, priority: rule.priority, matched: rule.fallback ? true : trace.matched, fallback: Boolean(rule.fallback), trace };
    });

  const selected = evaluated.find((rule) => rule.matched) || evaluated[evaluated.length - 1];
  if (!selected) throw new Error('At least one enabled personalization rule is required');
  const conflicts = evaluated
    .filter((rule) => rule.matched && !rule.fallback && rule.priority === selected.priority && rule.id !== selected.id)
    .map((rule) => rule.id);

  return { selectedRuleId: selected.id, evaluated, conflicts };
}
