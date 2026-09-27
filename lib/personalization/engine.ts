import { PersonalizationOverrides, PersonalizationRequest, PersonalizationResult } from '@/lib/types';
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
    overrides?: PersonalizationOverrides
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

    const segment = buildUserSegment(request, isNewUser, experimentVariant);
    const variant = selectVariant(segment);

    return {
      userId,
      segment,
      variant,
      experimentVariant,
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
