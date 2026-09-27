import { UserSegment, PersonalizationRequest } from '../types';
import { personalizationConfig } from '@/config/personalization';
import { evaluateRules } from './rules';
import type { SegmentRule } from '../types';

export function detectDevice(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  const ua = userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

export function buildUserSegment(
  request: PersonalizationRequest,
  isNewUser: boolean,
  experimentVariant?: string,
  rules: SegmentRule[] = personalizationConfig.segments
){
  const decision = evaluateRules(rules, request);

  const segment: UserSegment = {
    id: decision.selectedRuleId,
    country: request.country ?? 'unknown',
    device: request.device as 'mobile' | 'desktop' | 'tablet',
    isNewUser,
    experimentVariant,
    language: request.language,
    localHour: request.localHour,
    referrer: request.referrer,
    network: request.network,
  };

  return { segment, decision };
}
