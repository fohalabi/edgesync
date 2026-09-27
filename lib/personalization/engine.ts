import { ContentVariant, PersonalizationOverrides, PersonalizationRequest, PersonalizationResult, RuntimeExperiment, SegmentRule } from '@/lib/types';
import { getCookie, generateUserId, COOKIES } from '@/lib/utils/cookies';
import { assignExperimentVariant, assignWeightedVariant } from '../utils/hash';
import { detectDevice, buildUserSegment } from './segments';
import { selectVariant } from './variants';
import { personalizationConfig } from '@/config/personalization';
import { evaluateGroup } from './rules';

export class PersonalizationEngine {
  static personalize(
    country: string | undefined,
    userAgent: string,
    cookieString: string,
    pathname: string,
    overrides?: PersonalizationOverrides,
    runtime?: { rules: SegmentRule[]; variants: ContentVariant[]; experiments?: RuntimeExperiment[] }
  ): PersonalizationResult {
    const existingUserId = getCookie(COOKIES.USER_ID, cookieString);
    const userId = existingUserId || generateUserId();
    const isNewUser = overrides?.visitor === 'new'
      ? true
      : overrides?.visitor === 'returning'
        ? false
        : !existingUserId;

    const device = overrides?.device || detectDevice(userAgent);

    const request: PersonalizationRequest = {
      country: overrides?.country || country,
      device,
      cookies: new Map(
        cookieString.split('; ').map((c) => {
          const [key, value] = c.split('=');
          return [key, value];
        })
      ),
      headers: new Map(),
      pathname,
      visitor: isNewUser ? 'new' : 'returning',
      language: overrides?.language || 'en',
      localHour: overrides?.localHour ?? new Date().getUTCHours(),
      referrer: overrides?.referrer || 'direct',
      network: overrides?.network || 'standard',
    };

    const built = buildUserSegment(request, isNewUser, undefined, runtime?.rules);
    const segment = built.segment;
    const decision = built.decision;
    let experimentVariant: string | undefined;
    let experimentId: string | undefined;
    let experimentGoal: string | undefined;
    let experimentContent: Partial<ContentVariant['content']> | undefined;
    const runtimeExperiment = runtime?.experiments?.find((experiment) => experiment.targetSegment === segment.id && evaluateGroup(experiment.audience, request).matched);

    if (runtimeExperiment) {
      experimentId = runtimeExperiment.id;
      experimentGoal = runtimeExperiment.goal;
      experimentVariant = assignWeightedVariant(userId, runtimeExperiment.id, runtimeExperiment.variants, runtimeExperiment.traffic);
      experimentContent = runtimeExperiment.variants.find((variant) => variant.key === experimentVariant)?.content;
    } else if (!runtime?.experiments?.length) {
      const activeExperiment = personalizationConfig.experiments.find((exp) => exp.enabled);
      if (activeExperiment) {
      const existingVariant = getCookie(COOKIES.EXPERIMENT, cookieString);
      
      if (existingVariant) {
        experimentVariant = existingVariant;
      } else {
        experimentVariant = assignExperimentVariant(
          userId,
          activeExperiment.id,
          activeExperiment.variants,
          activeExperiment.traffic
        );
      }
    }
    }
    segment.experimentVariant = experimentVariant;
    const baseVariant = selectVariant(segment, runtime?.variants);
    const variant = experimentContent ? { ...baseVariant, content: { ...baseVariant.content, ...experimentContent } } : baseVariant;

    return {
      userId,
      segment,
      variant,
      experimentVariant,
      experimentId,
      experimentGoal,
      decision,
    };
  }

  static getCookiesToSet(result: PersonalizationResult): Record<string, string> {
    const cookies: Record<string, string> = {
      [COOKIES.USER_ID]: result.userId,
      [COOKIES.SEGMENT]: result.segment.id,
    };

    if (result.experimentVariant) {
      cookies[COOKIES.EXPERIMENT] = result.experimentVariant;
    }

    if (result.segment.isNewUser) {
      cookies[COOKIES.FIRST_VISIT] = new Date().toISOString();
    }

    return cookies;
  }
}
