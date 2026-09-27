import { ContentVariant, PersonalizationOverrides, PersonalizationRequest, PersonalizationResult, SegmentRule } from '@/lib/types';
import { getCookie, generateUserId, COOKIES } from '@/lib/utils/cookies';
import { assignExperimentVariant } from '../utils/hash';
import { detectDevice, buildUserSegment } from './segments';
import { selectVariant } from './variants';
import { personalizationConfig } from '@/config/personalization';

export class PersonalizationEngine {
  static personalize(
    country: string | undefined,
    userAgent: string,
    cookieString: string,
    pathname: string,
    overrides?: PersonalizationOverrides,
    runtime?: { rules: SegmentRule[]; variants: ContentVariant[] }
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

    let experimentVariant: string | undefined;
    const activeExperiment = personalizationConfig.experiments.find(
      (exp) => exp.enabled
    );

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

    const { segment, decision } = buildUserSegment(request, isNewUser, experimentVariant, runtime?.rules);
    const variant = selectVariant(segment, runtime?.variants);

    return {
      userId,
      segment,
      variant,
      experimentVariant,
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
