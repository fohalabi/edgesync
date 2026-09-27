export type UserSegment = {
    id: string;
    country: string;
    device: 'mobile' | 'desktop' | 'tablet';
    isNewUser: boolean;
    experimentVariant?: string;
    language: string;
    localHour: number;
    referrer: ReferrerKind;
    network: NetworkQuality;
};

export type ContentVariant = {
    id: string;
    segment: string;
    content: {
        headline: string;
        subheadline: string;
        cta: string;
        theme?: 'default' | 'premium' | 'casual';
    };
    experimentContent?: Record<string, Partial<ContentVariant['content']>>;
};

export type PersonalizationConfig = {
  segments: SegmentRule[];
  variants: ContentVariant[];
  experiments: ExperimentConfig[];
};

export type SegmentRule = {
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  fallback?: boolean;
  expression: RuleGroup;
};

export type ContextField = 'country' | 'device' | 'visitor' | 'language' | 'localHour' | 'referrer' | 'network' | 'pathname';
export type RuleOperator = 'equals' | 'not_equals' | 'in' | 'not_in' | 'contains' | 'gte' | 'lte';
export type RuleValue = string | number | string[];
export type RuleCondition = { field: ContextField; operator: RuleOperator; value: RuleValue };
export type RuleGroup = { combinator: 'and' | 'or'; items: Array<RuleCondition | RuleGroup> };

export type ConditionTrace = RuleCondition & { actual: string | number; matched: boolean };
export type GroupTrace = { combinator: 'and' | 'or'; matched: boolean; items: Array<ConditionTrace | GroupTrace> };
export type RuleTrace = { id: string; name: string; priority: number; matched: boolean; fallback: boolean; trace: GroupTrace };
export type DecisionTrace = { selectedRuleId: string; evaluated: RuleTrace[]; conflicts: string[] };

export type ExperimentConfig = {
  id: string;
  name: string;
  enabled: boolean;
  variants: string[];
  traffic: number;
};

export type PersonalizationRequest = {
  country?: string;
  device: string;
  cookies: Map<string, string>;
  headers: Map<string, string>;
  pathname: string;
  visitor: 'new' | 'returning';
  language: string;
  localHour: number;
  referrer: ReferrerKind;
  network: NetworkQuality;
};

export type PersonalizationResult = {
  userId: string;
  segment: UserSegment;
  variant: ContentVariant;
  experimentVariant?: string;
  experimentId?: string;
  experimentGoal?: string;
  decision: DecisionTrace;
};

export type RuntimeExperimentVariant = { id: string; key: string; name: string; weight: number; content: Partial<ContentVariant['content']> };
export type RuntimeExperiment = { id: string; name: string; traffic: number; targetSegment: string; goal: string; audience: RuleGroup; variants: RuntimeExperimentVariant[] };

export type ReferrerKind = 'direct' | 'search' | 'social' | 'campaign';
export type NetworkQuality = 'fast' | 'standard' | 'slow';

export type PersonalizationOverrides = {
  country?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
  visitor?: 'new' | 'returning';
  language?: string;
  localHour?: number;
  referrer?: ReferrerKind;
  network?: NetworkQuality;
};
