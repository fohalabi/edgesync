import { UserSegment, PersonalizationRequest } from '../types';
import { personalizationConfig } from '@/config/personalization';

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

export function identifySegment(request: PersonalizationRequest): string {
  const sortedSegments = [...personalizationConfig.segments].sort(
    (a, b) => b.priority - a.priority
  );

  for (const segment of sortedSegments) {
    if (segment.matcher(request)) {
      return segment.id;
    }
  }

  return 'default';
}

export function buildUserSegment(
  request: PersonalizationRequest,
  isNewUser: boolean,
  experimentVariant?: string
): UserSegment {
  const segmentId = identifySegment(request);

  return {
    id: segmentId,
    country: request.country ?? 'unknown',
    device: request.device as 'mobile' | 'desktop' | 'tablet',
    isNewUser,
    experimentVariant,
  };
}